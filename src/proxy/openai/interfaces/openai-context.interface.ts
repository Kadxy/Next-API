import { BillingType, UpstreamProvider } from '@prisma-detail-client/client';
import { ApiCallRecordUncheckedCreateInput } from '@prisma-detail-client/models/ApiCallRecord';
import { ApiCallDetailUncheckedCreateInput } from '@prisma-detail-client/models/ApiCallDetail';
import { TransactionUncheckedCreateInput } from '@prisma-main-client/models/Transaction';
import { TransactionType, TransactionStatus } from '@prisma-main-client/enums';
import { Decimal } from '@prisma-main-client/internal/prismaNamespace';
import {
  BillingTokenData,
  ProxyContext,
} from '../../common/interfaces/proxy-context.interface';
import { LLMModel } from '@prisma-main-client/client';

/**
 * OpenAI服务的请求上下文
 */
export class OpenAIContext extends ProxyContext {
  // 强制实现的抽象属性
  readonly provider = UpstreamProvider.OPENAI;
  readonly billingType = BillingType.TOKEN;
  readonly transactionType = TransactionType.CONSUME;

  // OpenAI特有字段
  stream: boolean; // 是否流式
  llmModel: LLMModel; // LLM模型信息
  input_tokens?: number; // 输入token数量
  output_tokens?: number; // 输出token数量

  constructor() {
    super();
  }

  getBillingData(): BillingTokenData {
    return {
      input_tokens: this.input_tokens || -1,
      output_tokens: this.output_tokens || -1,
    };
  }

  calculateCost(): Decimal {
    // 如果设置为免费，直接返回0
    if (this.noCharge) {
      return new Decimal(0);
    }

    // 如果缺少必要数据，返回0（避免使用负数）
    if (!this.llmModel || !this.input_tokens || !this.output_tokens) {
      return new Decimal(0);
    }

    // 费用计算: inputPrice * inputTokens/1M + outputPrice * outputTokens/1M
    const inputCost = new Decimal(this.input_tokens)
      .mul(this.llmModel.inputPrice)
      .div(1000000);

    const outputCost = new Decimal(this.output_tokens)
      .mul(this.llmModel.outputPrice)
      .div(1000000);

    const totalCost = inputCost.plus(outputCost);

    // 向上取整到最小计费单位 (0.000001)
    const minBillingUnit = new Decimal(0.000001);
    if (totalCost.gt(0) && totalCost.lt(minBillingUnit)) {
      return minBillingUnit;
    }

    // 保留6位小数并向上取整
    return totalCost.toDecimalPlaces(6, Decimal.ROUND_UP);
  }

  getTransactionInfo(): TransactionUncheckedCreateInput {
    return {
      businessId: this.businessId,
      walletId: this.walletId,
      userId: this.userId,
      apiKeyId: this.apiKeyId,
      type: this.transactionType, // 消费类型
      amount: this.calculateCost(), // 现在会根据noCharge自动返回正确的金额
      description: this.noCharge
        ? `[${this.provider}-${this.model}] API call (No Charge)`
        : `[${this.provider}-${this.model}] API call`,
      status: this.noCharge
        ? TransactionStatus.COMPLETED // 免费交易标记为已完成, 无需等待周期处理
        : TransactionStatus.PENDING,
      createdAt: this.endTime || new Date(),
      updatedAt: this.endTime || new Date(),
    };
  }

  getApiCallRecord(): ApiCallRecordUncheckedCreateInput {
    return {
      // 不包含id字段，让数据库自动生成
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
      upstreamId: this.upstreamId || 0, // 确保upstreamId存在
      model: this.model,
      provider: this.provider,
      billingType: this.billingType,
      billingData: this.getBillingData(),
      createdAt: new Date(),
    };
  }

  getApiCallDetail(): ApiCallDetailUncheckedCreateInput {
    return {
      // 不包含id字段，让数据库自动生成
      businessId: this.businessId || null,
      requestBody: this.requestBody || null,
      responseBody: this.responseBody || null,
      responseText: this.responseText || null,
      internalErrorInfo: this.getInternalErrorInfo(),
      upstreamErrorInfo: this.getUpstreamErrorInfo(),
      createdAt: this.endTime || new Date(),
    };
  }
}
