import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../core/prisma/prisma.service';
import { UlidService } from '../core/ulid/ulid.service';
import {
  AIModelRequest,
  AIModelResponse,
  UpstreamConfig,
} from './interfaces/proxy.interface';
import { BillingService } from '../billing/billing.service';
import { AIModel, ApiKey, Wallet } from '@prisma-client';
import { BusinessException } from '../common/exceptions';
import { Decimal } from '@prisma-client/internal/prismaNamespace';
import {
  TikTokenResult,
  TiktokenService,
} from 'src/billing/tiktoken/tiktoken.service';

@Injectable()
export class ProxyService {
  public readonly proxyTimeoutMs = 60 * 1000; // 60秒超时
  private readonly logger = new Logger(ProxyService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly ulidService: UlidService,
    private readonly billingService: BillingService,
    private readonly tiktokenService: TiktokenService,
  ) {}

  /** 转发请求到上游服务 */
  async forwardPostRequest(
    path: string,
    body: AIModelRequest,
    apiKeyInfo: ApiKey & { wallet: Wallet },
  ): Promise<AIModelResponse> {
    const requestId = this.ulidService.generate();
    const startTime = Date.now();

    try {
      // 1. 检查钱包余额（只检查是否大于0）
      if (Number(apiKeyInfo.wallet.balance) <= 0) {
        throw new BusinessException('Insufficient balance');
      }

      // 2. 获取模型信息
      const model = await this.getModelInfo(body.model);
      if (!model) {
        throw new BusinessException(`Model ${body.model} not found`);
      }

      // 3. 选择上游服务（按权重）
      const upstream = await this.selectUpstream();

      // 4. 转发请求
      const response = await this.sendToUpstream(upstream, path, body);

      // 5. 记录计费信息（异步，不阻塞响应）
      const tiktokenResult = await this.tiktokenService.countTokens(
        body,
        response.choices[0].message.content,
      );

      if (tiktokenResult) {
        setImmediate(() => {
          this.billingService
            .recordApiCall({
              eventId: requestId,
              userId: apiKeyInfo.creatorId,
              walletId: apiKeyInfo.walletId,
              model: body.model,
              inputToken: tiktokenResult.inputTokens || 0,
              outputToken: tiktokenResult.outputTokens || 0,
              cost: this.calculateCost(model, tiktokenResult),
              status: 20000, // 成功
              durationMs: Date.now() - startTime,
              timestamp: new Date(),
            })
            .catch((err) => {
              this.logger.error(`Failed to record billing: ${err.message}`);
            });
        });
      }

      // 6. 添加响应头
      if (!response.id) {
        response.id = requestId;
      }

      return response;
    } catch (error) {
      // 记录失败的请求
      setImmediate(() => {
        this.billingService
          .recordApiCall({
            eventId: requestId,
            userId: apiKeyInfo.creatorId,
            walletId: apiKeyInfo.walletId,
            model: body.model,
            inputToken: 0,
            outputToken: 0,
            cost: 0,
            status: error.response?.status || 50000,
            durationMs: Date.now() - startTime,
            timestamp: new Date(),
            errorMessage: error.message,
          })
          .catch((err) => {
            this.logger.error(
              `Failed to record failed billing: ${err.message}`,
            );
          });
      });

      throw error;
    }
  }

  /** 获取模型信息 */
  private async getModelInfo(modelName: string) {
    return await this.prisma.aIModel.findFirst({
      where: { name: modelName, isActive: true },
    });
  }

  /** 选择上游服务（基于权重的负载均衡）*/
  private async selectUpstream(): Promise<UpstreamConfig> {
    const channels = await this.prisma.aIModelChannel.findMany({
      where: { status: 'ACTIVE' },
    });

    if (!channels.length) {
      throw new BusinessException('No available upstream service');
    }

    // 单个上游直接返回
    if (channels.length === 1) {
      return channels[0];
    }

    // 权重随机选择
    const totalWeight = channels.reduce((sum, c) => sum + c.weight, 0);
    let random = Math.random() * totalWeight;

    for (const channel of channels) {
      random -= channel.weight;
      if (random < 0) {
        return channel;
      }
    }

    return channels[0]; // 兜底（理论上不会到这里）
  }

  /** 发送请求到上游 */
  private async sendToUpstream(
    upstream: UpstreamConfig,
    path: string,
    body: any,
  ): Promise<AIModelResponse> {
    const url = `${upstream.baseUrl}${path}`;

    const upstreamHeaders = {
      Authorization: `Bearer ${upstream.apiKey}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, {
          headers: upstreamHeaders,
          timeout: this.proxyTimeoutMs,
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Upstream request failed: ${error.message}`);
      throw new BusinessException(
        'Upstream service error',
        error.response?.status || 500,
      );
    }
  }

  /** 计算费用 */
  private calculateCost(model: AIModel, tiktoken: TikTokenResult): Decimal {
    return new Decimal(model.inputPrice)
      .mul(tiktoken.inputTokens)
      .add(new Decimal(model.outputPrice).mul(tiktoken.outputTokens));
  }
}
