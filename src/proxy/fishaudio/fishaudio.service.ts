import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as msgpack from '@msgpack/msgpack';
import { FISHAUDIO_TTS_MODELS } from './interfaces/fishaudio.interface';
import { TransactionService } from '../../transaction/transaction.service';
import { ApiKey, UpstreamConfig } from '@prisma-main-client/client';
import { APICallException } from '../../common/exceptions';
import { FishAudioContext } from './interfaces/fishaudio-context.interface';
import { PrismaService } from '../../core/prisma/prisma.service';
import { ProxyBaseService } from '../common/proxy-base.service';
import { UpstreamProvider } from '@prisma-detail-client/client';
import { UlidService } from 'src/core/ulid/ulid.service';

interface RetryInfo {
  count: number;
  excludeIds: UpstreamConfig['id'][];
}

@Injectable()
export class FishAudioService
  extends ProxyBaseService<any, any, FishAudioContext>
  implements OnModuleDestroy
{
  public readonly maxRetryTime = 3;
  protected readonly paths = {
    tts: '/v1/tts',
    asr: '/v1/asr',
    models: '/model',
  };
  protected readonly provider = UpstreamProvider.FISH_AUDIO;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly httpService: HttpService,
    protected readonly transactionService: TransactionService,
    private readonly ulidService: UlidService,
  ) {
    super(prisma, httpService, transactionService);
  }

  async onModuleDestroy() {
    this.upstreams.clear();
  }

  // 统一创建context
  createContext(
    requestBody: any,
    apiKey: ApiKey,
    clientIp: string,
    userAgent: string,
    externalTraceId: string,
    serviceType: 'tts' | 'asr' | 'model' = 'tts',
  ): FishAudioContext {
    const context = new FishAudioContext();

    // 基础信息
    context.businessId = this.ulidService.generate();
    context.userId = apiKey.creatorId;
    context.walletId = apiKey.walletId;
    context.apiKeyId = apiKey.id;
    context.clientIp = clientIp;
    context.userAgent = userAgent;
    context.externalTraceId = externalTraceId;
    context.startTime = new Date();
    context.requestBody = requestBody;
    context.serviceType = serviceType;

    // 根据服务类型设置模型和计费
    if (serviceType === 'tts') {
      context.model = 'fishaudio-tts';
      // TTS计费：解析text计算UTF-8字节数
      if (requestBody.text) {
        context.setInputText(requestBody.text);
      }
    } else if (serviceType === 'asr') {
      context.model = 'fishaudio-asr';
      // ASR计费：粗略计算时间（假设1MB = 10秒音频）
      if (requestBody.audio) {
        const audioSizeBytes = Buffer.isBuffer(requestBody.audio)
          ? requestBody.audio.length
          : (requestBody.audio as Buffer).length;
        const estimatedDurationMs = (audioSizeBytes / 1024 / 1024) * 10 * 1000; // 1MB ≈ 10秒
        context.audioDurationMs = Math.max(estimatedDurationMs, 1000); // 最少1秒
      }
    }

    return context;
  }

  forwardRequest(): Promise<any> {
    return Promise.reject(
      new Error(
        'Use specific forward methods (forwardTTSStream or forwardASR)',
      ),
    );
  }

  // TTS流式转发
  async forwardTTSStream(
    body: any,
    context: FishAudioContext,
  ): Promise<NodeJS.ReadableStream> {
    // 立即记录计费（开始时计费）
    setImmediate(() => this.recordTransaction(context));

    const { url, config } = await this.getUpstream(context, [], this.paths.tts);

    try {
      const msgpackData = msgpack.encode(body);

      const response = await firstValueFrom(
        this.httpService.post(url, msgpackData, {
          ...config,
          headers: {
            ...config.headers,
            'Content-Type': 'application/msgpack',
          },
          responseType: 'stream',
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`TTS upstream error: ${error.message}`);
      throw new APICallException(context);
    }
  }

  // ASR直接转发
  async forwardASR(body: any, context: FishAudioContext): Promise<any> {
    // 立即记录计费（开始时计费）
    setImmediate(() => this.recordTransaction(context));

    const { url, config } = await this.getUpstream(context, [], this.paths.asr);

    try {
      const msgpackData = msgpack.encode(body);

      const response = await firstValueFrom(
        this.httpService.post(url, msgpackData, {
          ...config,
          headers: {
            ...config.headers,
            'Content-Type': 'application/msgpack',
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`ASR upstream error: ${error.message}`);
      throw new APICallException(context);
    }
  }

  // 模型列表
  async getModelsFromUpstream(context: FishAudioContext): Promise<any> {
    const { url, config } = await this.getUpstream(
      context,
      [],
      this.paths.models,
    );

    try {
      const response = await firstValueFrom(this.httpService.get(url, config));
      return response.data;
    } catch (error) {
      this.logger.error(`Models upstream error: ${error.message}`);
      throw new APICallException(context);
    }
  }

  // 简单记录交易
  private async recordTransaction(context: FishAudioContext): Promise<void> {
    try {
      context.endTime = new Date();
      await this.createRecords(context);
      this.logger.debug(`Transaction recorded for ${context.businessId}`);
    } catch (error) {
      this.logger.error(`Failed to record transaction: ${error.message}`);
    }
  }

  // 获取可用模型
  async getAvailableModels(): Promise<string[]> {
    return Object.keys(FISHAUDIO_TTS_MODELS);
  }
}
