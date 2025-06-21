import {
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  All,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ProxyService } from './proxy.service';
import { ApiKeyGuard } from '../apikey/guards/api-key.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Proxy')
@Controller()
@UseGuards(ApiKeyGuard)
@ApiBearerAuth()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  // TODO: 处理 get models 请求
  // @Get('v1/models')

  @All('v1/*')
  @HttpCode(HttpStatus.OK)
  async handleV1Request(
    @Req() request: FastifyRequest & { apiKey: any },
    @Res() reply: FastifyReply,
  ) {
    const path = request.url.replace(/^\/v1/, '');
    // const method = request.method;
    const body = request.body as any;
    // const headers = request.headers as Record<string, string>;

    try {
      // 转发请求
      const response = await this.proxyService.forwardPostRequest(
        path,
        body,
        request.apiKey,
      );

      // 设置响应头
      reply.header('X-Request-ID', response.id || '');
      reply.header('Content-Type', 'application/json');

      // 发送响应
      return reply.send(response);
    } catch (error) {
      // 错误处理
      const statusCode = error.status || 500;
      const message = error.message || 'Internal server error';

      return reply.status(statusCode).send({
        error: {
          message,
          type: error.name || 'api_error',
          code: statusCode,
        },
      });
    }
  }

  /**
   * 处理流式请求 (SSE)
   */
  @Post('v1/chat/completions')
  @HttpCode(HttpStatus.OK)
  async handleStreamRequest(
    @Req() request: FastifyRequest & { apiKey: any },
    @Res() reply: FastifyReply,
  ) {
    const body = request.body as any;

    // 如果不是流式请求，交给通用处理器
    if (!body.stream) {
      return this.handleV1Request(request, reply);
    }

    // TODO: 实现流式响应处理
    // 这里需要特殊处理 SSE 流
    reply.header('Content-Type', 'text/event-stream');
    reply.header('Cache-Control', 'no-cache');
    reply.header('Connection', 'keep-alive');

    // 临时实现：返回错误
    return reply.status(501).send({
      error: {
        message: 'Streaming not implemented yet',
        type: 'not_implemented',
        code: 501,
      },
    });
  }
}
