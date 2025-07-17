import { AIModel } from '@prisma-main-client/client';
import { Decimal } from '@prisma-main-client/internal/prismaNamespace';
import { AIModelRequest } from 'src/proxy/interfaces/proxy.interface';

// 请求上下文，贯穿整个请求生命周期
export class BillingContext {
  // 核心标识
  requestId: string; // 请求ID (ULID)
  userId: number; // 用户ID
  walletId: number; // 钱包ID
  apikeyId: number; // APIKeyId

  // 请求信息
  model: AIModel; // 模型名称
  clientIp: string; // 客户端IP
  externalTraceId: string; // 外部追踪ID（如果有）
  requestPath?: string; // 请求路径
  upstreamId?: number; // 上游服务ID
  retryCount?: number; // 重试次数

  // 请求和响应内容（用于存储到 MongoDB）
  requestBody?: AIModelRequest; // 原始请求体
  responseBody?: any; // 非流式响应的完整响应体
  responseText?: string; // 流式响应的文本内容或非流式响应提取的文本

  // 时间信息
  startTime: Date; // 开始时间
  endTime?: Date; // 结束时间

  // 计费信息（请求结束后填充）
  inputTokens?: number; // 输入 token 数量
  outputTokens?: number; // 输出 token 数量
  cost?: Decimal; // 费用

  // 错误信息
  errorMessage?: string; // 错误消息
  errorStack?: string; // 错误堆栈

  // 计算持续时间（毫秒）
  get durationMs(): number {
    if (!this.endTime) return 0;
    return this.endTime.getTime() - this.startTime.getTime();
  }
}

// Token 使用情况
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

// 从 OpenAI 响应中提取 token 使用情况
export function extractTokenUsage(response: any): TokenUsage | null {
  if (!response?.usage) return null;

  return {
    promptTokens: response.usage.prompt_tokens || 0,
    completionTokens: response.usage.completion_tokens || 0,
    totalTokens: response.usage.total_tokens || 0,
  };
}
