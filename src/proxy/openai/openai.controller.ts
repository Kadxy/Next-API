import {
  Controller,
  Post,
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
import { OpenAIService } from './openai.service';
import {
  ApiKeyGuard,
  RequestWithApiKey,
} from '../../apikey/guards/api-key.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AIModelRequest } from './interfaces/proxy.interface';
import { OpenAIContext } from './interfaces/openai-context.interface';
import { PassThrough } from 'stream';

export const REQUEST_ID_HEADER = 'X-APIGrip-RequestId';
export const EXTERNAL_TRACE_ID_HEADER = 'X-APIGrip-ExternalTraceId';

@ApiTags('OpenAI')
@Controller('openai')
@UseGuards(ApiKeyGuard)
export class OpenAIController {
  private readonly logger = new Logger(OpenAIController.name);

  constructor(private readonly openAIService: OpenAIService) {}

  // @ApiOperation({ summary: '获取可用的模型列表' })
  // @Get('models')
  // async getModels(@Res() reply: FastifyReply) {
  //   return reply.status(HttpStatus.OK).send({
  //     object: 'list',
  //     data: await this.openAIService.getAvailableModels(),
  //   });
  // }

  @ApiOperation({ summary: 'chat completion api' })
  @Post('v1/chat/completions')
  @HttpCode(HttpStatus.OK)
  async handleChatCompletions(
    @Body() body: AIModelRequest,
    @Res() reply: FastifyReply,
    @Req() request: RequestWithApiKey,
    @Ip() clientIp: string,
    @Headers(EXTERNAL_TRACE_ID_HEADER) externalTraceId: string = '',
    @Headers('user-agent') userAgent: string = '',
  ) {
    const apiKey = request.apiKey;

    const ctx = this.openAIService.createContext(
      body,
      apiKey,
      clientIp,
      userAgent,
      externalTraceId,
    );

    // 设置响应头
    this.setupResponseHeaders(reply, ctx);

    // 根据是否为流式请求选择不同的处理方式
    if (ctx.stream) {
      return this.handleStreamRequest(body, ctx, reply);
    } else {
      return this.handleNormalRequest(body, ctx, reply);
    }
  }

  // 处理非流式请求
  private async handleNormalRequest(
    body: AIModelRequest,
    context: OpenAIContext,
    reply: FastifyReply,
  ) {
    let isClientDisconnected = false;
    let isTransactionProcessed = false;

    const { businessId: requestId } = context;

    // 监听客户端断开连接
    reply.raw.on('close', () => {
      if (!reply.raw.writableEnded && !isTransactionProcessed) {
        isClientDisconnected = true;
        this.logger.warn(
          `[${requestId}] Client disconnected for, waiting upstream complete`,
        );
      }
    });

    try {
      const response = await this.openAIService.forwardNonStreamRequest(
        body,
        context,
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
    } catch (error) {
      isTransactionProcessed = true;

      this.logger.error(
        `[${requestId}] Non-stream request failed: ${error.message}`,
      );

      // 返回JSON错误响应
      return reply.status(HttpStatus.SERVICE_UNAVAILABLE).send({
        error: {
          message:
            error.message || 'All upstream services are currently unavailable',
          type: 'upstream_error',
          code: 'service_unavailable',
        },
      });
    }
  }

  // 处理流式请求
  private async handleStreamRequest(
    body: AIModelRequest,
    context: OpenAIContext,
    reply: FastifyReply,
  ) {
    let isClientDisconnected = false;
    const { businessId } = context;

    try {
      // 使用service的封装方法获取流处理器
      const { upstreamStream, dataCollector, processTransaction } =
        await this.openAIService.createStreamHandler(body, context);

      // 创建客户端流
      const clientStream = new PassThrough();

      // 设置超时机制
      const timeoutMs = this.openAIService.proxyTimeoutMs + 10000;
      const transactionTimeout = setTimeout(() => {
        this.logger.warn(
          `Transaction timeout for ${businessId}, forcing transaction process`,
        );
        processTransaction(true, 'Request timeout');
      }, timeoutMs);

      const cleanup = () => {
        clearTimeout(transactionTimeout);
      };

      // 监听客户端断开连接
      reply.raw.on('close', () => {
        if (!reply.raw.writableEnded) {
          isClientDisconnected = true;
          this.logger.warn(
            `Client disconnected for stream request ${businessId}`,
          );
          clientStream.destroy();
        }
      });

      // 处理上游数据
      upstreamStream.on('data', (chunk: Buffer) => {
        const chunkStr = chunk.toString();
        dataCollector.push(chunkStr);

        // 只有客户端连接时才发送数据
        if (!isClientDisconnected && !clientStream.destroyed) {
          clientStream.write(chunk);
        }
      });

      upstreamStream.on('end', () => {
        cleanup();
        this.logger.debug(
          `Upstream stream ended for ${businessId}, collected ${dataCollector.length} chunks`,
        );

        // 处理计费
        setImmediate(() => processTransaction(false));

        // 结束客户端流
        if (!isClientDisconnected && !clientStream.destroyed) {
          clientStream.end();
        }
      });

      upstreamStream.on('error', (error) => {
        cleanup();
        this.logger.error(
          `Upstream stream error for ${businessId}: ${error.message}`,
        );

        // 处理错误计费
        setImmediate(() => processTransaction(true, error.message));

        // 处理客户端流错误
        if (!isClientDisconnected && !clientStream.destroyed) {
          clientStream.destroy(error);
        }
      });

      // 处理客户端流错误
      clientStream.on('error', (error) => {
        this.logger.debug(
          `Client stream error for ${businessId}: ${error.message}`,
        );
      });

      return reply.send(clientStream);
    } catch (error) {
      // 当所有上游都失败时，返回错误响应
      this.logger.error(
        `Failed to create stream handler for ${businessId}: ${error.message}`,
      );

      // 返回JSON错误响应
      return reply.status(HttpStatus.SERVICE_UNAVAILABLE).send({
        error: {
          message:
            error.message || 'All upstream services are currently unavailable',
          type: 'upstream_error',
          code: 'service_unavailable',
        },
      });
    }
  }

  // 设置响应头
  private setupResponseHeaders(reply: FastifyReply, context: OpenAIContext) {
    const { businessId, externalTraceId, stream } = context;

    // 必须发送的header
    reply.header(REQUEST_ID_HEADER, businessId);

    // 如果请求者携带了externalTraceId, 则继续发送给下游
    if (externalTraceId) {
      reply.header(EXTERNAL_TRACE_ID_HEADER, externalTraceId);
    }

    // 非流式响应, 设置json响应头
    if (!stream) {
      reply.header('Content-Type', 'application/json');
    } else {
      // 流式响应, 设置流式响应头
      reply.header('Content-Type', 'text/event-stream');
      reply.header('Cache-Control', 'no-cache');
      reply.header('Connection', 'keep-alive');
    }
  }
}
