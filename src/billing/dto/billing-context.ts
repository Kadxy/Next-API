import { AIModel } from '@prisma-client';
import { OpenAIRequest } from '../tiktoken/tiktoken.service';

export class BillingContext {
  // 核心信息
  requestId: string; // 请求ID
  userId: number; // 用户ID
  walletId: number; // 钱包ID
  clientIp: string; // 客户端IP[<=45位]
  externalTraceId: string; // 外部追踪ID[<=63位]

  // 请求与响应信息
  model: AIModel; // 模型对象
  requestBody: OpenAIRequest; // 请求体
  responseText: string; // 响应文本
  errorMessage: string | null; // 错误信息(如有, 说明调用失败)

  // 计费
  inputToken: number; // 输入 token 数量
  outputToken: number; // 输出 token 数量
  cost: number; // 费用, 以当前模型价格计算

  // 时间信息
  startTime: Date; // 开始时间
  endTime: Date | null; // 结束时间(如果调用失败, 则结束时间为 null)
  durationMs: number; // 持续时间(单位: ms)
}
