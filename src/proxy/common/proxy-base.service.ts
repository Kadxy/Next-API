import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UpstreamProvider } from '@prisma-detail-client/client';
import { TransactionService } from '../../transaction/transaction.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ProxyContext } from './interfaces/proxy-context.interface';
import { UpstreamConfig } from '@prisma-main-client/client';
import { ApiKey } from '@prisma-main-client/client';
import { AxiosRequestConfig } from 'axios';
import { APICallException, BusinessException } from '../../common/exceptions';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FishAudioContext } from '../fishaudio/interfaces/fishaudio-context.interface';

/**
 * 代理服务的抽象基类
 * 所有具体的代理服务（OpenAI、FishAudio等）都应该继承此类
 */
@Injectable()
export abstract class ProxyBaseService<
  TRequest = any,
  TResponse = any,
  TContext extends ProxyContext = ProxyContext,
> implements OnModuleInit
{
  protected readonly logger: Logger;
  protected upstreams: Map<number, UpstreamConfig> = new Map();
  public readonly proxyTimeoutMs = 10 * 60 * 1000; // 10分钟

  // 子类必须指定其支持的provider类型
  protected abstract readonly provider: UpstreamProvider;

  // 子类必须指定其支持的API路径
  protected abstract readonly paths: Record<string, string>;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly httpService: HttpService,
    protected readonly transactionService: TransactionService,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  async onModuleInit() {
    await this.loadUpstreams();
  }

  // 定期刷新上游配置
  @Cron(CronExpression.EVERY_5_MINUTES)
  protected async loadUpstreams() {
    const upstreams = await this.prisma.main.upstreamConfig.findMany({
      where: { type: this.provider },
    });

    this.upstreams.clear();
    upstreams.forEach((upstream) => this.upstreams.set(upstream.id, upstream));

    this.logger.log(
      `✅ Loaded ${this.upstreams.size} upstreams for ${this.provider}`,
    );
  }

  /**
   * 创建请求上下文
   * 子类需要实现此方法以创建特定的上下文
   */
  abstract createContext(
    request: TRequest,
    apiKey: ApiKey,
    clientIp: string,
    userAgent: string,
    externalTraceId: string,
  ): TContext;

  /**
   * 转发请求到上游服务
   * 子类需要实现具体的转发逻辑
   */
  abstract forwardRequest(
    request: TRequest,
    context: TContext,
  ): Promise<TResponse>;

  /**
   * 创建交易和api记录, 自动从上下文获取数据
   * 通用方法，子类可以直接使用
   */
  protected async createRecords(context: TContext): Promise<void> {
    await Promise.all([
      this.prisma.main.transaction.create({
        data: context.getTransactionInfo(),
      }),
      this.prisma.detail.apiCallRecord.create({
        data: context.getApiCallRecord(),
      }),
      this.prisma.detail.apiCallDetail.create({
        data: context.getApiCallDetail(),
      }),
    ]);
  }

  /**
   * 基于权重选择上游服务
   * @param context
   * @param excludeIds 需要排除的上游ID列表（用于重试）
   * @param path API路径（如 /v1/chat/completions）
   * @returns 上游ID和请求配置
   */
  protected async getUpstream(
    context: ProxyContext,
    excludeIds: UpstreamConfig['id'][] = [],
    path: string, // 直接传入路径字符串
  ): Promise<{ id: number; url: string; config: AxiosRequestConfig }|null> {
    let availableTotalWeight = 0;
    const availableUpstreams: UpstreamConfig[] = [];

    // 遍历全部上游，过滤掉已排除的上游
    for (const upstream of this.upstreams.values()) {
      if (!excludeIds.includes(upstream.id)) {
        availableUpstreams.push(upstream);
        availableTotalWeight += upstream.weight;
      }
    }

    // 如果没有可用上游，抛出异常
    if (availableUpstreams.length === 0) {
      throw new APICallException(context,'no available upstream');
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
      // 如果没有选中任何上游，选择最后一个作为兜底
      selectedUpstream = availableUpstreams[availableUpstreams.length - 1];
    }

    // 返回请求配置
    return {
      id: selectedUpstream.id,
      url: [selectedUpstream.baseUrl, path].join(''),
      config: {
        headers: {
          Authorization: `Bearer ${selectedUpstream.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.proxyTimeoutMs,
      },
    };
  }
}
