import { Decimal } from '@prisma-main-client/internal/prismaNamespace';
import { BillingType, UpstreamProvider } from '@prisma-detail-client/client';
import { ApiCallRecordUncheckedCreateInput } from '@prisma-detail-client/models/ApiCallRecord';
import { ApiCallDetailUncheckedCreateInput } from '@prisma-detail-client/models/ApiCallDetail';
import { TransactionUncheckedCreateInput } from '@prisma-main-client/models/Transaction';
import { TransactionType } from '@prisma-main-client/enums';
import { ULID } from 'ulid';

/**
 * 通用的代理请求上下文
 * 所有具体的代理服务都需要继承此抽象类
 */
export abstract class ProxyContext {
  // 核心标识
  businessId: ULID; // 请求ID/业务ID (ULID)
  userId: number; // 用户ID
  walletId: number; // 钱包ID
  apiKeyId: number; // API Key ID

  // 请求者信息
  clientIp: string; // 客户端IP
  userAgent: string; // 用户代理
  externalTraceId: string; // 外部追踪ID

  // 请求信息
  model: string; // 模型/服务名称（用于显示）
  description: string; // 描述

  // 上游信息 - 抽象属性，强制子类实现
  abstract readonly provider: UpstreamProvider; // 服务提供商
  upstreamId: number; // 上游服务ID

  // 时间信息
  startTime: Date; // 开始时间
  endTime: Date; // 结束时间
  get durationMs(): number {
    if (!this.endTime) return 0;
    return this.endTime.getTime() - this.startTime.getTime();
  }

  // 计费信息 - 抽象属性，强制子类实现
  abstract readonly transactionType: TransactionType; // 交易类型
  abstract readonly billingType: BillingType; // 计费类型

  // 计费控制
  noCharge: boolean = false; // 是否免费（错误、系统异常等情况下设为true）

  // 抽象方法 - 计费相关
  abstract calculateCost(): Decimal; // 计算费用
  abstract getBillingData(): BillingTokenData; // 获取计费数据

  // 详细日志信息
  requestBody: any; // 请求体
  responseBody: any; // 非流式响应体
  responseText: string; // 流式响应的纯文本

  // 结构化错误信息收集
  private internalErrors: Array<{
    timestamp: Date;
    message: string;
    context?: string;
  }> = [];

  private upstreamErrors: Array<{
    timestamp: Date;
    upstreamId?: number;
    upstreamName?: string;
    message: string;
    statusCode?: number;
    retryCount?: number;
  }> = [];

  // 抽象方法 - 数据转换（使用UncheckedCreateInput类型）
  abstract getTransactionInfo(): TransactionUncheckedCreateInput; // 获取Transaction信息
  abstract getApiCallRecord(): ApiCallRecordUncheckedCreateInput; // 获取ApiCallRecord
  abstract getApiCallDetail(): ApiCallDetailUncheckedCreateInput; // 获取ApiCallDetail

  /**
   * 设置请求为免费（通常在错误情况下调用）
   * @param reason 免费原因
   */
  setNoCharge(): void {
    this.noCharge = true;
  }

  /**
   * 添加内部错误信息
   * @param message 错误信息
   * @param context 错误上下文
   */
  addInternalError(message: string, context?: string): void {
    this.internalErrors.push({
      timestamp: new Date(),
      message,
      context,
    });
  }

  /**
   * 添加上游错误信息
   * @param message 错误信息
   * @param options 额外选项
   */
  addUpstreamError(
    message: string,
    options?: {
      upstreamId?: number;
      upstreamName?: string;
      statusCode?: number;
      retryCount?: number;
    },
  ): void {
    this.upstreamErrors.push({
      timestamp: new Date(),
      message,
      upstreamId: options?.upstreamId,
      upstreamName: options?.upstreamName,
      statusCode: options?.statusCode,
      retryCount: options?.retryCount,
    });
  }

  /**
   * 获取内部错误信息的JSON对象，如果没有错误返回null
   */
  getInternalErrorInfo(): Array<{
    timestamp: Date;
    message: string;
    context?: string;
  }> | null {
    return this.internalErrors.length > 0 ? this.internalErrors : null;
  }

  /**
   * 获取上游错误信息的JSON对象，如果没有错误返回null
   */
  getUpstreamErrorInfo(): Array<{
    timestamp: Date;
    upstreamId?: number;
    upstreamName?: string;
    message: string;
    statusCode?: number;
    retryCount?: number;
  }> | null {
    return this.upstreamErrors.length > 0 ? this.upstreamErrors : null;
  }
}

export type BillingTokenData = {
  input_tokens: number;
  output_tokens: number;
  total_tokens?: number;
};

export type BillingDurationData = {
  duration_ms: number;
};

export type BillingRequestData = {
  request_count: number;
};

export type BillingData =
  | BillingTokenData
  | BillingDurationData
  | BillingRequestData;
