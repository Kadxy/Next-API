import { BillingType, UpstreamProvider } from '@prisma-detail-client/client';
import { ApiCallRecordUncheckedCreateInput } from '@prisma-detail-client/models/ApiCallRecord';
import { ApiCallDetailUncheckedCreateInput } from '@prisma-detail-client/models/ApiCallDetail';
import { TransactionUncheckedCreateInput } from '@prisma-main-client/models/Transaction';
import { TransactionType, TransactionStatus } from '@prisma-main-client/enums';
import { Decimal } from '@prisma-main-client/internal/prismaNamespace';
import {
  BillingData,
  BillingBytesData,
  BillingDurationData,
  ProxyContext,
} from '../../common/interfaces/proxy-context.interface';

/**
 * FishAudio服务的请求上下文（支持TTS和ASR）
 */
export class FishAudioContext extends ProxyContext {
  // 强制实现的抽象属性
  readonly provider = UpstreamProvider.FISH_AUDIO;
  readonly transactionType = TransactionType.CONSUME;

  // 服务类型（影响计费方式）
  serviceType: 'tts' | 'asr' | 'model' = 'tts';

  // 通用字段
  audioFormat?: 'wav' | 'pcm' | 'mp3' | 'opus'; // 音频格式
  mp3Bitrate?: 64 | 128 | 192; // MP3比特率
  opusBitrate?: -1000 | 24 | 32 | 48 | 64; // Opus比特率
  latencyMode?: 'normal' | 'balanced'; // 延迟模式

  // TTS特有字段
  inputText?: string; // 输入文本
  inputTextBytes?: number; // 输入文本UTF-8字节数

  // ASR特有字段
  audioDurationMs?: number; // 音频时长（毫秒）
  audioSizeBytes?: number; // 音频文件大小（字节）

  // TTS计费常量：$15.00 / million UTF-8 bytes
  private static readonly TTS_COST_PER_MILLION_BYTES = new Decimal(15.0);

  // ASR计费常量：$0.36 / hour
  private static readonly ASR_COST_PER_HOUR = new Decimal(0.36);
  private static readonly MIN_BILLING_DURATION_MS = 1000; // 最小计费时长 1秒

  constructor() {
    super();
  }

  // 根据服务类型返回对应的billingType
  get billingType(): BillingType {
    switch (this.serviceType) {
      case 'tts':
        return BillingType.TOKEN; // 使用TOKEN类型表示按字节计费
      case 'asr':
        return BillingType.TIME;
      default:
        return BillingType.PER_REQUEST;
    }
  }

  getBillingData(): BillingData {
    switch (this.serviceType) {
      case 'tts':
        return {
          input_bytes: this.inputTextBytes || 0,
          total_bytes: this.inputTextBytes || 0,
        } as BillingBytesData;
      case 'asr':
        return {
          duration_ms: this.audioDurationMs || 0,
        } as BillingDurationData;
      default:
        return {
          request_count: 1,
        };
    }
  }

  calculateCost(): Decimal {
    // 如果设置为免费，直接返回0
    if (this.noCharge) {
      return new Decimal(0);
    }

    switch (this.serviceType) {
      case 'tts': {
        // TTS按UTF-8字节数计费
        if (!this.inputTextBytes || this.inputTextBytes <= 0) {
          return new Decimal(0);
        }

        // 计算费用: (字节数 / 1,000,000) * $15.00
        const millionBytes = new Decimal(this.inputTextBytes).div(1000000);
        const totalCost = millionBytes.mul(
          FishAudioContext.TTS_COST_PER_MILLION_BYTES,
        );

        // 向上取整到最小计费单位 (0.000001)
        const minBillingUnit = new Decimal(0.000001);
        if (totalCost.gt(0) && totalCost.lt(minBillingUnit)) {
          return minBillingUnit;
        }

        return totalCost.toDecimalPlaces(6, Decimal.ROUND_UP);
      }
      case 'asr': {
        // ASR按时长计费
        if (!this.audioDurationMs || this.audioDurationMs <= 0) {
          return new Decimal(0);
        }

        // 使用最小计费时长
        const billingDurationMs = Math.max(
          this.audioDurationMs,
          FishAudioContext.MIN_BILLING_DURATION_MS,
        );

        // 转换为小时
        const durationHours = new Decimal(billingDurationMs).div(
          1000 * 60 * 60,
        );

        // 计算费用: 小时数 * $0.36
        const totalCost = durationHours.mul(FishAudioContext.ASR_COST_PER_HOUR);

        // 向上取整到最小计费单位
        const minBillingUnit = new Decimal(0.000001);
        if (totalCost.gt(0) && totalCost.lt(minBillingUnit)) {
          return minBillingUnit;
        }

        return totalCost.toDecimalPlaces(6, Decimal.ROUND_UP);
      }
      default:
        // 模型管理等操作通常免费
        return new Decimal(0);
    }
  }

  getTransactionInfo(): TransactionUncheckedCreateInput {
    return {
      businessId: this.businessId,
      walletId: this.walletId,
      userId: this.userId,
      apiKeyId: this.apiKeyId,
      type: this.transactionType,
      amount: this.calculateCost(),
      description: this.noCharge
        ? `[${this.provider}-${this.model}] TTS call (No Charge)`
        : `[${this.provider}-${this.model}] TTS call`,
      status: this.noCharge
        ? TransactionStatus.COMPLETED
        : TransactionStatus.PENDING,
      createdAt: this.endTime || new Date(),
      updatedAt: this.endTime || new Date(),
    };
  }

  getApiCallRecord(): ApiCallRecordUncheckedCreateInput {
    return {
      businessId: this.businessId,
      userId: this.userId,
      walletId: this.walletId,
      apiKeyId: this.apiKeyId,
      clientIp: this.clientIp,
      userAgent: this.userAgent,
      externalTraceId: this.externalTraceId,
      startTime: this.startTime,
      endTime: this.endTime,
      durationMs: this.durationMs,
      upstreamId: this.upstreamId || 0,
      model: this.model,
      provider: this.provider,
      billingType: this.billingType,
      billingData: this.getBillingData(),
      createdAt: new Date(),
    };
  }

  getApiCallDetail(): ApiCallDetailUncheckedCreateInput {
    return {
      businessId: this.businessId || null,
      requestBody: this.requestBody || null,
      responseBody: this.responseBody || null,
      responseText: this.responseText || null,
      internalErrorInfo: this.getInternalErrorInfo(),
      upstreamErrorInfo: this.getUpstreamErrorInfo(),
      createdAt: this.endTime || new Date(),
    };
  }

  /**
   * 设置音频时长和相关信息
   * @param durationMs 音频时长（毫秒）
   * @param sizeBytes 音频大小（字节，可选）
   */
  setAudioInfo(durationMs: number, sizeBytes?: number): void {
    this.audioDurationMs = durationMs;
    if (sizeBytes) {
      this.audioSizeBytes = sizeBytes;
    }
  }

  /**
   * 估算音频时长（当无法获取精确时长时使用）
   * 基于文本长度和语速估算
   */
  estimateAudioDuration(): number {
    if (!this.inputText) return 0;

    // 估算: 平均每分钟150-200个单词，中文每分钟300-400个字符
    // 这里使用保守估算: 每分钟300个字符
    const estimatedMinutes = this.inputText.length / 300;
    return Math.max(
      estimatedMinutes * 60 * 1000,
      FishAudioContext.MIN_BILLING_DURATION_MS,
    );
  }

  /**
   * 设置输入文本并计算UTF-8字节数
   */
  setInputText(text: string): void {
    this.inputText = text;
    this.inputTextBytes = Buffer.byteLength(text, 'utf8');
  }
}
