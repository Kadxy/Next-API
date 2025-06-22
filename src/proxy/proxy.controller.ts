import {
  Controller,
  Post,
  Get,
  Res,
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
import { ApiKeyGuard } from '../apikey/guards/api-key.guard';
import { ApiTags } from '@nestjs/swagger';
import { UlidService } from 'src/core/ulid/ulid.service';
import { AIModelRequest } from './interfaces/proxy.interface';

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
    @Ip() clientIp: string,
    @Headers('X-APIGrip-ExternalTraceId') externalTraceId: string,
  ) {
    const sourceId = this.ulidService.generate();

    this.logger.debug(`[${clientIp}] [${sourceId}] [${externalTraceId}]`);

    try {
      const response = await this.proxyService.forwardRequest(body, sourceId);

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
      return reply.status(error.status || 500).send({
        error: {
          message: error.message || 'Internal server error',
          type: error.name || 'api_error',
          code: error.status || 500,
        },
      });
    }
  }
}
