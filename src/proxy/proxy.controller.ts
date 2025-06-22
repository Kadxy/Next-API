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
import { FastifyReply, FastifyRequest } from 'fastify';
import { ProxyService } from './proxy.service';
import { ApiKeyGuard } from '../apikey/guards/api-key.guard';
import { ApiTags } from '@nestjs/swagger';
import { UlidService } from 'src/core/ulid/ulid.service';
import { AIModelRequest } from './interfaces/proxy.interface';
import { ApiKey, Wallet } from '@prisma-client';

@ApiTags('Proxy')
@Controller()
@UseGuards(ApiKeyGuard)
export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);
  constructor(
    private readonly proxyService: ProxyService,
    private readonly ulidService: UlidService,
  ) {}

  @Get('v1/models')
  @HttpCode(HttpStatus.OK)
  async getModels(@Res() reply: FastifyReply) {
    return reply.send([]);
  }

  @Post('v1/chat/completions')
  @HttpCode(HttpStatus.OK)
  async handleV1Request(
    @Body() body: AIModelRequest,
    @Res() reply: FastifyReply,
    @Req() request: FastifyRequest,
    @Ip() clientIp: string,
    @Headers('X-APIGrip-ExternalTraceId') externalTraceId: string,
  ) {
    const sourceId = this.ulidService.generate();
    const startTime = new Date();

    // 从ApiKeyGuard获取API密钥信息
    const apiKeyRecord = (request as any).apiKey as ApiKey & { wallet: Wallet };

    this.logger.debug(
      `[${clientIp}] [${sourceId}] [${externalTraceId}] User: ${apiKeyRecord.creatorId}, Wallet: ${apiKeyRecord.walletId}`,
    );

    try {
      const response = await this.proxyService.forwardRequest(body, sourceId, {
        eventId: sourceId,
        userId: apiKeyRecord.creatorId,
        walletId: apiKeyRecord.walletId,
        clientIp,
        externalTraceId,
        startTime,
      });

      // 设置流式响应头
      if (body?.stream) {
        reply.header('Content-Type', 'text/event-stream');
        reply.header('Cache-Control', 'no-cache');
        reply.header('Connection', 'keep-alive');
      } else {
        reply.header('Content-Type', 'application/json');
      }

      // 设置APIGrip SourceId
      reply.header('X-APIGrip-SourceId', sourceId);

      // 设置外部traceId
      if (externalTraceId) {
        reply.header('X-APIGrip-ExternalTraceId', externalTraceId);
      }

      // 发送响应
      return reply.send(response);
    } catch (error) {
      // 记录失败的计费信息
      this.recordFailedBilling(
        apiKeyRecord,
        sourceId,
        body,
        clientIp,
        externalTraceId,
        startTime,
        error,
      );

      return reply.status(error.status || 500).send({
        error: {
          message: error.message || 'Internal server error',
          type: error.name || 'api_error',
          code: error.status || 500,
        },
      });
    }
  }

  /**
   * 异步记录失败的计费信息
   */
  private recordFailedBilling(
    apiKeyRecord: ApiKey & { wallet: Wallet },
    sourceId: string,
    requestBody: AIModelRequest,
    clientIp: string,
    externalTraceId: string,
    startTime: Date,
    error: any,
  ) {
    // 使用 setTimeout 来异步处理，不阻塞响应
    setTimeout(async () => {
      try {
        await this.proxyService.recordFailedBilling({
          eventId: sourceId,
          userId: apiKeyRecord.creatorId,
          walletId: apiKeyRecord.walletId,
          model: requestBody.model,
          clientIp,
          externalTraceId,
          startTime,
          endTime: new Date(),
          requestBody,
          responseBody: null,
          status: error.status || 500,
          errorMessage: error.message || 'Internal server error',
        });
      } catch (billingError) {
        this.logger.error(
          `Failed to record billing for failed request: ${billingError.message}`,
        );
      }
    }, 0);
  }
}
