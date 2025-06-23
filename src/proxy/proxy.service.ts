import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../core/prisma/prisma.service';
import { AIModelRequest, AIModelResponse } from './interfaces/proxy.interface';
import { BillingService } from '../billing/billing.service';
import { AIModel, BillStatus, UpstreamConfig } from '@prisma-client';
import { APICallException, BusinessException } from '../common/exceptions';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ULID } from 'ulid';
import { AxiosRequestConfig } from 'axios';
import { BillingContext } from 'src/billing/dto/billing-context';
import { TiktokenService } from 'src/billing/tiktoken/tiktoken.service';
import { Decimal } from '@prisma-client/internal/prismaNamespace';

@Injectable()
export class ProxyService implements OnModuleInit, OnModuleDestroy {
  public readonly proxyTimeoutMs = 180 * 1000; // 180秒超时
  private readonly logger = new Logger(ProxyService.name);

  private models: Map<string, AIModel> = new Map();
  private upstreams: Map<number, UpstreamConfig> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly billingService: BillingService,
    private readonly tiktokenService: TiktokenService,
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
    billingContext: BillingContext,
  ): Promise<AIModelResponse> {
    const { requestId } = billingContext;

    // 1. 检查模型是否支持
    const isModelSupported = this.models.has(body.model);
    if (!isModelSupported) {
      throw new APICallException(requestId, `model ${body.model} not support`);
    }

    // 2. 钱包余额检查

    // 3. 转发请求
    const response = await this.sendToUpstream(body, billingContext);

    // 3. 异步计算费用(不阻塞响应)
    // this.tiktokenService

    // 4. 异步处理计费(不阻塞响应)
    // this.billingService

    return response;
  }

  // 发送请求到上游
  private async sendToUpstream(
    body: AIModelRequest,
    billingContext: BillingContext,
    retry: { count: number; excludeIds: number[] } = {
      count: 0,
      excludeIds: [],
    },
  ): Promise<AIModelResponse> {
    const { id, config } = await this.getUpstream(retry.excludeIds);

    try {
      const response = await firstValueFrom(
        this.httpService.post(config.url, body, config),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Upstream request failed: ${error.message}`);

      if (retry.count < 3) {
        return this.sendToUpstream(body, billingContext, {
          count: retry.count + 1,
          excludeIds: [...retry.excludeIds, id],
        });
      } else {
        this.recordFailedBilling(billingContext); // 记录失败的计费信息
        throw new BusinessException('service error');
      }
    }
  }

  // 初始化: 加载上游渠道和模型
  @Cron(CronExpression.EVERY_5_MINUTES)
  private async initialize() {
    // load ai models
    await this.prisma.aIModel
      .findMany({ where: { isActive: true } })
      .then((m) => m.forEach((m) => this.models.set(m.name, m)));

    // load upstream configs
    await this.prisma.upstreamConfig
      .findMany()
      .then((c) => c.forEach((c) => this.upstreams.set(c.id, c)));

    this.logger.log(`✅ Loaded ${this.models.size} models`);
    this.logger.log(`✅ Loaded ${this.upstreams.size} upstreams`);
  }

  // 基于权重选择上游服务, 返回上游 id 和 axios请求配置
  private async getUpstream(
    excludeIds: number[],
  ): Promise<{ id: number; config: AxiosRequestConfig }> {
    let availableTotalWeight = 0;
    const availableUpstreams: UpstreamConfig[] = [];

    // 遍历全部上游, 过滤掉已排除的上游
    for (const upstream of this.upstreams.values()) {
      if (!excludeIds.includes(upstream.id)) {
        availableUpstreams.push(upstream);
        availableTotalWeight += upstream.weight;
      }
    }

    // 如果没有可用上游, 抛出异常
    if (availableUpstreams.length === 0) {
      throw new BusinessException('no available upstream');
    }

    // 权重随机选择上游
    let random = Math.random() * availableTotalWeight;
    let selectedUpstream: UpstreamConfig;

    for (const upstream of availableUpstreams) {
      random -= upstream.weight;
      if (random < 0) {
        this.logger.debug(`selected upstream: ${JSON.stringify(upstream)}`);
        selectedUpstream = upstream;
        break;
      }
    }

    if (!selectedUpstream) {
      // 如果没有选中任何上游, 选择最后一个作为兜底
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

  // 记录失败的计费信息
  private async recordFailedBilling(data: BillingContext) {
    try {
      await this.billingService.createBillingRecord({
        requestId: data.requestId,
        userId: data.userId,
        wallet: { connect: { id: data.walletId } },
        model: data.model.name,
        clientIp: data.clientIp,
        externalTraceId: data.externalTraceId.slice(0, 63),
        startTime: data.startTime,
        endTime: data.endTime || new Date(),
        inputToken: data.inputTokens || 0,
        outputToken: data.outputTokens || 0,
        cost: data.cost || new Decimal(0),
        billStatus: BillStatus.COMPLETED, // 失败请求无需计费, 直接标记为已完成
      });
    } catch (error) {
      this.logger.error(`Failed to record failed billing: ${error.message}`);
    }
  }
}
