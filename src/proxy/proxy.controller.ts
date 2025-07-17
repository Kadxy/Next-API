import {
  Controller,
  Post,
  Get,
  Res,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
  Headers,
  Body,
  Ip,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ProxyService } from './proxy.service';
import { ApiKeyGuard, RequestWithApiKey } from '../apikey/guards/api-key.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UlidService } from 'src/core/ulid/ulid.service';
import { AIModelRequest } from './interfaces/proxy.interface';
import { TransactionContext } from 'src/transaction/dto/transaction-context';
import { Transform, PassThrough } from 'stream';

export const REQUEST_ID_HEADER = 'X-APIGrip-RequestId';
export const EXTERNAL_TRACE_ID_HEADER = 'X-APIGrip-ExternalTraceId';

@ApiTags('Proxy')
@Controller('v1')
@UseGuards(ApiKeyGuard)
export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);

  constructor(
    private readonly ulidService: UlidService,
    private readonly proxyService: ProxyService,
  ) {}

  @ApiOperation({ summary: '获取可用的模型列表' })
  @Get('models')
  async getModels(@Res() reply: FastifyReply) {
    return reply.status(HttpStatus.OK).send({
      object: 'list',
      data: await this.proxyService.getAvailableModels(),
    });
  }

  @ApiOperation({ summary: 'chat completion api' })
  @Post('chat/completions')
  @HttpCode(HttpStatus.OK)
  async handleChatCompletions(
    @Body() body: AIModelRequest,
    @Res() reply: FastifyReply,
    @Req() request: RequestWithApiKey,
    @Ip() clientIp: string,
    @Headers(EXTERNAL_TRACE_ID_HEADER) externalTraceId: string = '',
  ) {
    // 1. 生成本次请求的 requestId
    const requestId = this.ulidService.generate();

    // 2. 从 ApiKeyGuard 获取 API密钥信息
    const apiKeyRecord = request.apiKey;

    // 3. 初始化 TransactionContext（只包含基本信息）
    const transactionContext = new TransactionContext();
    transactionContext.requestId = requestId;
    transactionContext.walletId = apiKeyRecord.walletId;
    transactionContext.userId = apiKeyRecord.creatorId;
    transactionContext.apikeyId = apiKeyRecord.id;
    transactionContext.clientIp = clientIp;
    transactionContext.externalTraceId = externalTraceId.slice(0, 63); // 限制长度
    transactionContext.startTime = new Date();

    // 4. 设置响应头
    this.setupResponseHeaders(reply, requestId, externalTraceId, body.stream);

    // 5. 根据是否为流式请求选择不同的处理方式
    if (body.stream) {
      return this.handleStreamRequest(body, transactionContext, reply);
    } else {
      return this.handleNormalRequest(body, transactionContext, reply);
    }
  }

  // 处理非流式请求
  private async handleNormalRequest(
    body: AIModelRequest,
    transactionContext: TransactionContext,
    reply: FastifyReply,
  ) {
    let isClientDisconnected = false;
    let isTransactionProcessed = false;

    const { requestId } = transactionContext;

    // 监听客户端断开连接
    reply.raw.on('close', () => {
      if (!reply.raw.writableEnded && !isTransactionProcessed) {
        isClientDisconnected = true;
        this.logger.warn(
          `[${requestId}] Client disconnected for, waiting upstream complete`,
        );
      }
    });

    const response = await this.proxyService.forwardNonStreamRequest(
      body,
      transactionContext,
    );
    isTransactionProcessed = true;

    // 如果客户端还连接，正常返回响应
    if (!isClientDisconnected) {
      return reply.send(response);
    } else {
      // 客户端已断开，但计费已处理，记录日志
      this.logger.debug(
        `[${requestId}] Request completed but client disconnected, transaction already processed`,
      );
      return;
    }
  }

  // 处理流式请求
  private async handleStreamRequest(
    body: AIModelRequest,
    transactionContext: TransactionContext,
    reply: FastifyReply,
  ) {
    const upstreamStream = await this.proxyService.forwardStreamRequest(
      body,
      transactionContext,
    );

    // 用于收集完整响应数据的独立流
    let fullResponseData = '';
    let isClientDisconnected = false;
    let isTransactionProcessed = false;
    let upstreamEnded = false;
    let upstreamError: Error | null = null;

    // 创建一个 PassThrough 流用于向客户端发送数据
    const clientStream = new PassThrough();

    // 创建一个 Transform 流用于数据收集和转发
    const dataCollector = new Transform({
      transform(chunk: Buffer, _encoding, callback) {
        const chunkStr = chunk.toString();
        fullResponseData += chunkStr;

        // 始终向数据收集器推送数据
        this.push(chunk);
        callback();
      },
    });

    // 处理计费的函数
    const processTransaction = async (isError = false, errorMessage?: string) => {
      if (isTransactionProcessed) return;
      isTransactionProcessed = true;

      transactionContext.endTime = new Date();

      try {
        if (isError) {
          await this.proxyService.recordFailedTransaction(transactionContext);
          this.logger.debug(
            `Failed transaction processed for ${transactionContext.requestId}: ${errorMessage}`,
          );
        } else {
          await this.proxyService.processStreamTransaction(
            body,
            fullResponseData,
            transactionContext,
          );
          this.logger.debug(
            `Stream transaction processed for ${transactionContext.requestId}, client disconnected: ${isClientDisconnected}, data length: ${fullResponseData.length}`,
          );
        }
      } catch (err) {
        this.logger.error(
          `Failed to process transaction for ${transactionContext.requestId}: ${err.message}`,
        );
      }
    };

    // 设置超时机制
    const transactionTimeout = setTimeout(() => {
      if (!isTransactionProcessed) {
        this.logger.warn(
          `Transaction timeout for ${transactionContext.requestId}, forcing transaction process with collected data`,
        );
        processTransaction(true, 'Request timeout');
      }
    }, this.proxyService.proxyTimeoutMs + 10000);

    const cleanup = () => {
      clearTimeout(transactionTimeout);
    };

    // 监听客户端断开连接
    reply.raw.on('close', () => {
      if (!reply.raw.writableEnded) {
        isClientDisconnected = true;
        this.logger.warn(
          `Client disconnected for stream request ${transactionContext.requestId}, data collected: ${fullResponseData.length} chars`,
        );

        // 停止向客户端发送数据，但继续收集上游数据
        clientStream.destroy();

        // 如果上游已经结束且还没计费，立即处理计费
        if (upstreamEnded && !isTransactionProcessed) {
          this.logger.debug(
            `Processing transaction immediately for disconnected client ${transactionContext.requestId}`,
          );
          cleanup();
          setImmediate(() => {
            if (upstreamError) {
              processTransaction(true, upstreamError.message);
            } else {
              processTransaction(false);
            }
          });
        }
      }
    });

    // 监听上游流事件
    upstreamStream.on('end', () => {
      upstreamEnded = true;
      this.logger.debug(
        `Upstream stream ended for ${transactionContext.requestId}, collected ${fullResponseData.length} chars`,
      );
      cleanup();
      setImmediate(() => processTransaction(false));
    });

    upstreamStream.on('error', (error) => {
      upstreamEnded = true;
      upstreamError = error;
      this.logger.error(
        `Upstream stream error for ${transactionContext.requestId}: ${error.message}`,
      );
      cleanup();
      setImmediate(() => processTransaction(true, error.message));
    });

    // 监听数据收集器错误
    dataCollector.on('error', (error) => {
      this.logger.error(
        `Data collector error for ${transactionContext.requestId}: ${error.message}`,
      );
      // 数据收集器错误不影响计费，继续等待上游完成
    });

    // 监听客户端流错误
    clientStream.on('error', (error) => {
      this.logger.debug(
        `Client stream error for ${transactionContext.requestId}: ${error.message}`,
      );
      // 客户端流错误（通常是断开导致的）不影响上游处理
    });

    // 设置数据流管道：上游 -> 数据收集器 -> 客户端流（如果连接）
    upstreamStream.pipe(dataCollector);

    // 只有在客户端连接时才将数据发送给客户端
    dataCollector.on('data', (chunk) => {
      if (!isClientDisconnected && !clientStream.destroyed) {
        clientStream.write(chunk);
      }
    });

    dataCollector.on('end', () => {
      if (!isClientDisconnected && !clientStream.destroyed) {
        clientStream.end();
      }
    });

    // 将客户端流发送给客户端
    return reply.send(clientStream);
  }

  // 设置响应头
  private setupResponseHeaders(
    reply: FastifyReply,
    requestId: string,
    externalTraceId?: string,
    isStream = false,
  ) {
    // 必须发送的header
    reply.header(REQUEST_ID_HEADER, requestId);

    // 如果请求者携带了externalTraceId, 则继续发送给下游
    if (externalTraceId) {
      reply.header(EXTERNAL_TRACE_ID_HEADER, externalTraceId);
    }

    // 非流式响应, 设置json响应头
    if (!isStream) {
      reply.header('Content-Type', 'application/json');
    } else {
      // 流式响应, 设置流式响应头
      reply.header('Content-Type', 'text/event-stream');
      reply.header('Cache-Control', 'no-cache');
      reply.header('Connection', 'keep-alive');
    }
  }
}
