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
import { FishAudioService } from './fishaudio.service';
import {
  ApiKeyGuard,
  RequestWithApiKey,
} from '../../apikey/guards/api-key.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PassThrough } from 'stream';

export const REQUEST_ID_HEADER = 'X-APIGrip-RequestId';
export const EXTERNAL_TRACE_ID_HEADER = 'X-APIGrip-ExternalTraceId';

@ApiTags('FishAudio')
@Controller('fish-audio')
@UseGuards(ApiKeyGuard)
export class FishAudioController {
  private readonly logger = new Logger(FishAudioController.name);

  constructor(private readonly fishAudioService: FishAudioService) {}

  @ApiOperation({ summary: '获取模型列表（透传）' })
  @Get('model')
  async getModels(
    @Res() reply: FastifyReply,
    @Req() request: RequestWithApiKey,
  ) {
    const context = this.fishAudioService.createContext(
      {},
      request.apiKey,
      '',
      '',
      '',
      'model',
    );

    try {
      const response =
        await this.fishAudioService.getModelsFromUpstream(context);
      return reply.send(response);
    } catch (error) {
      return reply.status(HttpStatus.SERVICE_UNAVAILABLE).send({
        error: { message: 'Service unavailable' },
      });
    }
  }

  @ApiOperation({ summary: 'TTS（流式透传）' })
  @Post('v1/tts')
  @HttpCode(HttpStatus.OK)
  async handleTTS(
    @Body() body: any,
    @Res() reply: FastifyReply,
    @Req() request: RequestWithApiKey,
    @Ip() clientIp: string,
    @Headers(EXTERNAL_TRACE_ID_HEADER) externalTraceId: string = '',
    @Headers('user-agent') userAgent: string = '',
  ) {
    const ctx = this.fishAudioService.createContext(
      body,
      request.apiKey,
      clientIp,
      userAgent,
      externalTraceId,
      'tts',
    );

    // 设置响应头
    reply.header(REQUEST_ID_HEADER, ctx.businessId);
    if (externalTraceId) {
      reply.header(EXTERNAL_TRACE_ID_HEADER, externalTraceId);
    }

    try {
      // 获取上游流
      const upstreamStream = await this.fishAudioService.forwardTTSStream(
        body,
        ctx,
      );

      // 直接pipe给客户端，完全透传
      return reply.send(upstreamStream);
    } catch (error) {
      this.logger.error(`TTS error: ${error.message}`);

      // 如果上游返回JSON错误，也要透传
      if (error.response?.data) {
        reply.status(error.response.status || 500);
        return reply.send(error.response.data);
      }

      return reply.status(HttpStatus.SERVICE_UNAVAILABLE).send({
        error: { message: 'TTS service unavailable' },
      });
    }
  }

  @ApiOperation({ summary: 'ASR（完全透传）' })
  @Post('v1/asr')
  @HttpCode(HttpStatus.OK)
  async handleASR(
    @Body() body: any,
    @Res() reply: FastifyReply,
    @Req() request: RequestWithApiKey,
    @Ip() clientIp: string,
    @Headers(EXTERNAL_TRACE_ID_HEADER) externalTraceId: string = '',
    @Headers('user-agent') userAgent: string = '',
  ) {
    const ctx = this.fishAudioService.createContext(
      body,
      request.apiKey,
      clientIp,
      userAgent,
      externalTraceId,
      'asr',
    );

    // 设置响应头
    reply.header(REQUEST_ID_HEADER, ctx.businessId);
    if (externalTraceId) {
      reply.header(EXTERNAL_TRACE_ID_HEADER, externalTraceId);
    }

    try {
      const response = await this.fishAudioService.forwardASR(body, ctx);
      return reply.send(response);
    } catch (error) {
      this.logger.error(`ASR error: ${error.message}`);

      // 如果上游返回JSON错误，也要透传
      if (error.response?.data) {
        reply.status(error.response.status || 500);
        return reply.send(error.response.data);
      }

      return reply.status(HttpStatus.SERVICE_UNAVAILABLE).send({
        error: { message: 'ASR service unavailable' },
      });
    }
  }
}
