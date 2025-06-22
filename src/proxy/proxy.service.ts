import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../core/prisma/prisma.service';
import {
  AIModelRequest,
  AIModelResponse,
  UpstreamConfig,
  BillingRawData,
} from './interfaces/proxy.interface';
import { BillingService } from '../billing/billing.service';
import { AIModel } from '@prisma-client';
import { BusinessException } from '../common/exceptions';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ULID } from 'ulid';
import { AxiosRequestConfig } from 'axios';

// 简化的计费上下文
interface BillingContext {
  eventId: string;
  userId: number;
  walletId: number;
  clientIp: string;
  externalTraceId?: string;
  startTime: Date;
}

@Injectable()
export class ProxyService implements OnModuleInit, OnModuleDestroy {
  public readonly proxyTimeoutMs = 180 * 1000; // 180秒超时
  private readonly logger = new Logger(ProxyService.name);

  private upstreams: Map<number, UpstreamConfig> = new Map<
    number,
    UpstreamConfig
  >();
  private models: Map<string, AIModel> = new Map<string, AIModel>();

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
  ) {}

  async onModuleInit() {
    await this.initialize();
  }

  async onModuleDestroy() {
    this.models.clear();
    this.upstreams.clear();
  }

  // 转发请求到上游服务
  async forwardRequest(
    body: AIModelRequest,
    sourceId: ULID,
    billingContext: BillingContext,
  ): Promise<AIModelResponse> {
    // 1. 检查模型是否支持
    const isModelSupported = this.models.has(body.model);
    if (!isModelSupported) {
      throw new BusinessException(
        `model ${body.model} not support. RequestId:${sourceId}`,
      );
    }

    // TODO: 添加钱包余额快速检查（可选，用 Redis 缓存）
    // TODO: 处理流式响应 (stream: true) 的情况 - 需要特殊处理 SSE

    // 2. 转发请求
    const response = await this.sendToUpstream(body);

    // 3. 异步处理计费（不阻塞响应）
    setTimeout(async () => {
      try {
        await this.billingService.recordApiCall({
          eventId: billingContext.eventId,
          userId: billingContext.userId,
          walletId: billingContext.walletId,
          model: body.model,
          clientIp: billingContext.clientIp,
          externalTraceId: billingContext.externalTraceId,
          startTime: billingContext.startTime,
          endTime: new Date(),
          requestBody: body,
          responseBody: response,
          status: 20000, // 成功状态
        });

        this.logger.debug(`Billing recorded for ${billingContext.eventId}`);
      } catch (error) {
        this.logger.error(
          `Failed to process billing for ${billingContext.eventId}: ${error.message}`,
        );
      }
    }, 0);

    return response;
  }

  // 记录失败的计费信息
  async recordFailedBilling(billingData: BillingRawData) {
    try {
      await this.billingService.recordApiCall(billingData);
    } catch (error) {
      this.logger.error(`Failed to record failed billing: ${error.message}`);
    }
  }

  // 发送请求到上游
  private async sendToUpstream(
    body: AIModelRequest,
    retry: { count: number; exceptIds: number[] } = { count: 0, exceptIds: [] },
  ): Promise<AIModelResponse> {
    this.logger.debug(`retry: ${JSON.stringify(retry)}`);

    const { id, config } = await this.getUpstream(retry.exceptIds);

    try {
      const response = await firstValueFrom(
        this.httpService.post(config.url, body, config),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Upstream request failed: ${error.message}`);

      if (retry.count < 3) {
        return this.sendToUpstream(body, {
          count: retry.count + 1,
          exceptIds: [...retry.exceptIds, id],
        });
      } else {
        throw new BusinessException('service error');
      }
    }
  }

  // 初始化: 加载上游渠道和模型
  @Cron(CronExpression.EVERY_5_MINUTES)
  private async initialize() {
    // load upstreams
    const channels = await this.prisma.aIModelChannel.findMany();

    channels.map((c) => this.upstreams.set(c.id, c));

    this.logger.log(`Loaded ${this.upstreams.size} upstreams`);

    // load models
    const models = await this.prisma.aIModel.findMany({
      where: { isActive: true },
    });

    models.map((m) => this.models.set(m.name, m));

    this.logger.log(`Loaded ${this.models.size} models`);
  }

  // 基于权重选择上游服务, 返回上游id 和 axios请求配置
  private async getUpstream(
    exceptIds: number[],
  ): Promise<{ id: number; config: AxiosRequestConfig }> {
    // 计算可用上游的总权重
    let availableTotalWeight = 0;
    const availableUpstreams: UpstreamConfig[] = [];

    for (const upstream of this.upstreams.values()) {
      if (!exceptIds.includes(upstream.id)) {
        availableUpstreams.push(upstream);
        availableTotalWeight += upstream.weight;
      }
    }

    if (availableUpstreams.length === 0) {
      throw new BusinessException('no available upstream');
    }

    // 权重随机选择
    let random = Math.random() * availableTotalWeight;
    let selectedUpstream: UpstreamConfig;

    for (const upstream of availableUpstreams) {
      random -= upstream.weight;
      if (random < 0) {
        this.logger.debug(`selected channel: ${JSON.stringify(upstream)}`);
        selectedUpstream = upstream;
        break;
      }
    }

    if (!selectedUpstream) {
      // 如果没有选中任何上游，选择最后一个作为兜底
      selectedUpstream = availableUpstreams[availableUpstreams.length - 1];
    }

    // 返回请求配置
    return {
      id: selectedUpstream.id,
      config: {
        url: selectedUpstream.baseUrl + '/v1/chat/completions',
        headers: {
          Authorization: `Bearer ${selectedUpstream.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.proxyTimeoutMs,
      },
    };
  }
}
