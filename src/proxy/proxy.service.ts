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
  AIModelNonStreamResponse,
  AIModelStreamResponse,
  AIModelUsage,
} from './interfaces/proxy.interface';
import { BillingService } from '../billing/billing.service';
import { AIModel, BillStatus, UpstreamConfig } from '@prisma-client';
import { APICallException, BusinessException } from '../common/exceptions';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosRequestConfig } from 'axios';
import {
  BillingContext,
  extractTokenUsage,
} from 'src/billing/dto/billing-context';
import { TiktokenService } from 'src/billing/tiktoken/tiktoken.service';
import { Decimal } from '@prisma-client/internal/prismaNamespace';
import { ULID } from 'ulid';

interface RetryInfo {
  count: number;
  excludeIds: UpstreamConfig['id'][];
}

@Injectable()
export class ProxyService implements OnModuleInit, OnModuleDestroy {
  public readonly proxyTimeoutMs = 10 * 60 * 1000; // 10分钟
  public readonly maxRetryTime = 3;
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

  // 获取可用模型列表
  async getAvailableModels() {
    return Array.from(this.models.values()).map((model) => ({
      name: model.name,
      inputPrice: `$${new Decimal(model.inputPrice).mul(1000000).toFixed(2)}/1M tokens`,
      outputPrice: `$${new Decimal(model.outputPrice).mul(1000000).toFixed(2)}/1M tokens`,
    }));
  }

  // 转发请求到上游服务
  async forwardNonStreamRequest(
    body: AIModelRequest,
    billingContext: BillingContext,
  ): Promise<AIModelNonStreamResponse> {
    const { requestId } = billingContext;

    // 1. 检查并记录模型信息
    billingContext.model = this.checkModel(requestId, body.model);

    // 2. 存储请求体到 context
    billingContext.requestBody = body;

    try {
      // 3. 转发请求
      const response = await this.sendNonStreamToUpstream(body, billingContext);

      // 4. 记录结束时间
      billingContext.endTime = new Date();

      // 5. 存储响应体
      billingContext.responseBody = response;

      // 6. 提取或计算 token 使用量
      const usage = extractTokenUsage(response);
      if (usage) {
        // 如果响应中包含 usage 信息，直接使用
        billingContext.inputTokens = usage.promptTokens;
        billingContext.outputTokens = usage.completionTokens;
      } else {
        // 否则使用 tiktoken 计算
        const responseText = this.extractResponseText(response);
        billingContext.responseText = responseText; // 存储提取的文本

        const tokenResult = await this.tiktokenService.countTokens(
          body,
          responseText,
        );

        billingContext.inputTokens = tokenResult.inputTokens;
        billingContext.outputTokens = tokenResult.outputTokens;
      }

      // 7. 计算费用
      billingContext.cost = await this.calculateCost(
        billingContext.model,
        billingContext.inputTokens,
        billingContext.outputTokens,
      );

      // 8. 异步记录计费信息（不阻塞响应）
      setImmediate(() => {
        this.recordSuccessfulBilling(billingContext).catch((err) => {
          this.logger.error(
            `Failed to record billing for ${requestId}: ${err.message}`,
          );
        });
      });

      return response;
    } catch (error) {
      // 记录错误并重新抛出
      billingContext.endTime = new Date();
      throw error;
    }
  }

  // 转发流式请求到上游服务
  async forwardStreamRequest(
    body: AIModelRequest,
    billingContext: BillingContext,
  ): Promise<NodeJS.ReadableStream> {
    const { requestId } = billingContext;

    // 1. 检查并记录模型信息
    billingContext.model = this.checkModel(requestId, body.model);

    // 2. 存储请求体到 context
    billingContext.requestBody = body;

    try {
      // 3. 获取上游配置并发送流式请求
      const response = await this.sendStreamToUpstream(body, billingContext);
      return response;
    } catch (error) {
      // 记录错误并重新抛出
      billingContext.endTime = new Date();
      throw error;
    }
  }

  // 处理流式响应的计费
  async processStreamBilling(
    body: AIModelRequest,
    fullResponse: string,
    billingContext: BillingContext,
  ): Promise<void> {
    try {
      // 1. 解析SSE格式的响应，提取所有内容
      const { text, usage } = this.parseSSEResponse(fullResponse);
      billingContext.responseText = text; // 存储提取的文本

      // 2. 获取模型信息
      const modelInfo = this.models.get(body.model);
      if (!modelInfo) {
        this.logger.warn(`Model ${body.model} not found for billing`);
        return;
      }

      // 3.1 如果上游返回了 usage 信息，直接使用
      if (usage) {
        this.logger.debug(
          `request[${billingContext.requestId}] using upstream usage info`,
        );
        billingContext.inputTokens = usage.prompt_tokens;
        billingContext.outputTokens = usage.completion_tokens;
      } else {
        // 3.2 否则使用 tiktoken 计算 tokens
        this.logger.debug(
          `request[${billingContext.requestId}] using tiktoken to count tokens`,
        );
        const tokenResult = await this.tiktokenService.countTokens(body, text);
        billingContext.inputTokens = tokenResult.inputTokens;
        billingContext.outputTokens = tokenResult.outputTokens;
      }

      // 4. 计算费用
      billingContext.cost = await this.calculateCost(
        modelInfo,
        billingContext.inputTokens,
        billingContext.outputTokens,
      );

      // 5. 记录计费
      await this.recordSuccessfulBilling(billingContext);

      this.logger.debug(
        `Stream billing recorded for ${billingContext.requestId}: ${billingContext.inputTokens}+${billingContext.outputTokens} tokens, cost: ${billingContext.cost}`,
      );
    } catch (error) {
      this.logger.error(`Failed to process stream billing: ${error.message}`);
      // 即使计费处理失败，也要记录（费用为0）
      billingContext.cost = new Decimal(0);
      await this.recordSuccessfulBilling(billingContext);
    }
  }

  // 记录失败的计费信息（公开方法，供 Controller 调用）
  async recordFailedBilling(context: BillingContext): Promise<void> {
    await this.billingService.createBillingRecord({
      requestId: context.requestId,
      userId: context.userId,
      wallet: { connect: { id: context.walletId } },
      apikeyDisplayName: context.apikeyDisplayName,
      model: context.model.name,
      clientIp: context.clientIp,
      externalTraceId: context.externalTraceId,
      startTime: context.startTime,
      endTime: context.endTime || new Date(),
      durationMs: context.durationMs,
      inputToken: 0,
      outputToken: 0,
      cost: new Decimal(0),
      billStatus: BillStatus.COMPLETED, // 失败请求无需扣费，直接标记为已完成
    });

    this.logger.debug(`Failed billing recorded for ${context.requestId}`);
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

  // 计算最终费用
  private calculateCost(
    model: AIModel,
    inputTokens: number,
    outputTokens: number,
  ): Decimal {
    // 费用计算: inputPrice * inputTokens + outputPrice * outputTokens
    const inputCost = new Decimal(model.inputPrice).mul(inputTokens);
    const outputCost = new Decimal(model.outputPrice).mul(outputTokens);
    return inputCost.plus(outputCost);
  }

  // 提取响应中的文本内容
  private extractResponseText(response: AIModelNonStreamResponse): string {
    if (!response.choices || response.choices.length === 0) return '';

    const texts: string[] = [];

    for (const choice of response.choices) {
      // 提取普通 content
      if (choice.message?.content) {
        texts.push(choice.message.content);
      }

      // 提取 reasoning_content（某些模型如 deepseek 会返回）
      if (choice.message?.reasoning_content) {
        texts.push(choice.message.reasoning_content);
      }
    }

    return texts.join('\n');
  }

  // 记录成功的计费信息
  private async recordSuccessfulBilling(
    context: BillingContext,
  ): Promise<void> {
    await this.billingService.createBillingRecord({
      requestId: context.requestId,
      userId: context.userId,
      wallet: { connect: { id: context.walletId } },
      apikeyDisplayName: context.apikeyDisplayName,
      model: context.model.name,
      clientIp: context.clientIp,
      externalTraceId: context.externalTraceId,
      startTime: context.startTime,
      endTime: context.endTime || new Date(),
      durationMs: context.durationMs,
      errorMessage: null,
      inputToken: context.inputTokens || 0,
      outputToken: context.outputTokens || 0,
      cost: context.cost || new Decimal(0),
      billStatus: BillStatus.PENDING,
    });

    this.logger.debug(
      `Billing recorded for ${context.requestId}: ${context.inputTokens}+${context.outputTokens} tokens, cost: ${context.cost}`,
    );
  }

  // 发送非流式请求到上游
  private async sendNonStreamToUpstream(
    body: AIModelRequest,
    billingContext: BillingContext,
    retry: RetryInfo = { count: 0, excludeIds: [] },
  ): Promise<AIModelNonStreamResponse> {
    const { id, config } = await this.getUpstream(retry.excludeIds);

    try {
      const response = await firstValueFrom(
        this.httpService.post(config.url, body, config),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Upstream request failed: ${error.message}`);

      if (retry.count < this.maxRetryTime) {
        return this.sendNonStreamToUpstream(body, billingContext, {
          count: retry.count + 1,
          excludeIds: [...retry.excludeIds, id],
        });
      } else {
        throw new APICallException(billingContext.requestId, 'service error');
      }
    }
  }

  // 发送流式请求到上游
  private async sendStreamToUpstream(
    body: AIModelRequest,
    billingContext: BillingContext,
    retry: RetryInfo = { count: 0, excludeIds: [] },
  ): Promise<NodeJS.ReadableStream> {
    const { id, config } = await this.getUpstream(retry.excludeIds);

    try {
      const response = await firstValueFrom(
        this.httpService.post(config.url, body, {
          ...config,
          responseType: 'stream',
          maxRedirects: 0,
          decompress: true,
        }),
      );

      // 确保流有正确的事件处理
      const upstreamStream = response.data;

      // 添加流的基本日志和错误处理
      upstreamStream.on('error', (error) => {
        this.logger.error(
          `[${billingContext.requestId}] raw stream error: ${error.message}`,
        );
      });

      upstreamStream.on('end', () => {
        this.logger.debug(`[${billingContext.requestId}] raw stream ended`);
      });

      return upstreamStream;
    } catch (error) {
      this.logger.error(`Upstream stream request failed: ${error.message}`);

      if (retry.count < this.maxRetryTime) {
        return this.sendStreamToUpstream(body, billingContext, {
          count: retry.count + 1,
          excludeIds: [...retry.excludeIds, id],
        });
      } else {
        throw new APICallException(billingContext.requestId, 'service error');
      }
    }
  }

  // 解析 SSE 响应，返回文本内容和用量信息(如有)
  private parseSSEResponse(sseData: string): {
    text: string;
    usage: null | AIModelUsage;
  } {
    const lines = sseData.split('\n');
    const contents: string[] = [];
    let usage: AIModelUsage | null = null;

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const json = JSON.parse(data) as AIModelStreamResponse;

          // 提取所有可能的内容字段
          if (json?.choices) {
            for (const choice of json.choices) {
              // 流式响应的 delta
              if (choice.delta?.content) {
                contents.push(choice.delta.content);
              }
              if (choice.delta?.reasoning_content) {
                contents.push(choice.delta.reasoning_content);
              }
            }
          }

          // 如果响应包含 usage 信息，提取出来
          if (json?.usage) {
            usage = json?.usage;
          }
        } catch {
          // 忽略解析错误的行
        }
      }
    }

    return { text: contents.join(''), usage };
  }

  // 检查模型是否支持, 如果支持, 返回模型信息
  private checkModel(requestId: ULID, modelName: string): AIModel {
    const modelInfo = this.models.get(modelName);
    if (!modelInfo) {
      throw new APICallException(requestId, `model ${modelName} not supported`);
    }

    return modelInfo;
  }
}
