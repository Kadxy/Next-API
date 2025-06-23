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
import { ApiTags } from '@nestjs/swagger';
import { UlidService } from 'src/core/ulid/ulid.service';
import { AIModelRequest } from './interfaces/proxy.interface';
import { ApiKey, Wallet } from '@prisma-client';
import { BillingContext } from 'src/billing/dto/billing-context';
import { Decimal } from '@prisma-client/internal/prismaNamespace';

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

  @Get('models')
  async getModels(@Res() reply: FastifyReply) {
    return reply.status(HttpStatus.OK).send([]);
  }

  @Post('chat/completions')
  @HttpCode(HttpStatus.OK)
  async handleV1Request(
    @Body() body: AIModelRequest,
    @Res() reply: FastifyReply,
    @Req() request: RequestWithApiKey,
    @Ip() clientIp: string,
    @Headers(EXTERNAL_TRACE_ID_HEADER) externalTraceId: string,
  ) {
    // 0. 生成本次请求的 requestId
    const requestId = this.ulidService.generate();

    // 1. 立即记录开始时间
    const startTime = new Date().toISOString();

    // 2. 从 ApiKeyGuard 获取 附加到request 的 API密钥信息
    const apiKeyRecord = request.apiKey;

    // 3. 组装 billingContext
    const billingContext: BillingContext = {
      requestId,
      userId: apiKeyRecord.creatorId,
      walletId: apiKeyRecord.wallet.id,
      clientIp,
      externalTraceId,
      startTime: new Date(startTime),
      model: body.model,
      prompt: body.messages[0].content,
      response: '',
      status: 'pending',
      duration: 0,
      cost: new Decimal(0),
      error: undefined,
    };

    // 4. 转发请求到上游服务
    try {
      const response = await this.proxyService.forwardRequest(
        body,
        billingContext,
      );

      // 设置响应头
      this.setupResponseHeaders(
        reply,
        requestId,
        externalTraceId,
        body?.stream,
      );

      // 发送响应
      return reply.send(response);
    } catch (error) {
      // TODO: 记录失败的计费信息

      return this.errorReply(reply);
    }
  }

  // TODO: 异步记录失败的计费信息
  private recordFailedBilling() {
    // 使用 setTimeout 来异步处理，不阻塞响应?
  }

  // 设置响应头
  private setupResponseHeaders(
    reply: FastifyReply,
    requestId: string,
    externalTraceId = undefined,
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

  // 统一 type = api_error 错误响应
  private errorReply(
    reply: FastifyReply,
    message = 'service temporarily unavailable',
    code = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    const err = { type: 'api_error', message, code };
    return reply.status(code).send({ err });
  }
}
