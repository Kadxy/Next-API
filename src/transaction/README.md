# 计费系统设计文档

## 概述

计费系统采用异步批量处理的方式，确保高性能和准确性。

## 核心设计原则

1. **异步处理**：API调用和计费分离，不影响响应速度
2. **批量扣费**：定时批量处理，减少数据库压力
3. **幂等性**：通过唯一requestId保证不重复计费
4. **并发安全**：使用状态机和原子操作避免并发问题
5. **失败重试**：自动重试失败的计费记录

## 状态机设计

```
PENDING -> PROCESSING -> COMPLETED
                    \-> FAILED -> PENDING (重试)
```

- **PENDING**: 待计费状态，新创建的记录
- **PROCESSING**: 计费中，已被某个实例锁定
- **COMPLETED**: 计费完成
- **FAILED**: 计费失败，等待重试

## 计费流程详解

### 1. 请求接收阶段（ProxyController）

```typescript
// 初始化基础计费上下文
const transactionContext = new TransactionContext();
transactionContext.requestId = ulid();
transactionContext.userId = apiKey.creatorId;
transactionContext.walletId = apiKey.walletId;
transactionContext.clientIp = clientIp;
transactionContext.externalTraceId = externalTraceId;
transactionContext.startTime = new Date();
transactionContext.model = body.model;
```

### 2. 请求处理阶段（ProxyService）

```typescript
// 检查模型 -> 转发请求 -> 计算费用
async forwardRequest(body, transactionContext) {
  // 1. 检查模型是否支持
  const modelInfo = this.models.get(body.model);

  // 2. 转发请求到上游
  const response = await this.sendToUpstream(body);

  // 3. 记录结束时间
  transactionContext.endTime = new Date();

  // 4. 计算 token 使用量
  if (response.usage) {
    // 直接使用响应中的 usage
    transactionContext.inputTokens = response.usage.prompt_tokens;
    transactionContext.outputTokens = response.usage.completion_tokens;
  } else {
    // 使用 tiktoken 计算
    const result = await tiktokenService.countTokens(body, responseText);
    transactionContext.inputTokens = result.inputTokens;
    transactionContext.outputTokens = result.outputTokens;
  }

  // 5. 计算费用
  transactionContext.cost = inputPrice * inputTokens + outputPrice * outputTokens;

  // 6. 异步记录计费（不阻塞响应）
  setImmediate(() => this.recordTransaction(transactionContext));

  return response;
}
```

### 3. 计费记录阶段（异步）

```typescript
// 创建计费记录，状态为 PENDING
await transactionService.createTransactionRecord({
  requestId: context.requestId,
  walletId: context.walletId,
  userId: context.userId,
  model: context.model,
  inputToken: context.inputTokens,
  outputToken: context.outputTokens,
  cost: context.cost,
  billStatus: BillStatus.PENDING,
  // ... 其他字段
});
```

### 4. 批量扣费阶段（定时任务）

每分钟执行一次，处理流程：

1. 查询 PENDING 记录
2. 在事务中标记为 PROCESSING
3. 按钱包分组
4. 批量扣减余额
5. 更新状态为 COMPLETED

## 并发控制方案

### 问题分析

即使使用状态机，仍可能出现多个实例同时读取相同PENDING记录的问题。

### 解决方案

使用"先查询后更新"的两步原子操作：

1. **查询阶段**：获取一批PENDING记录的ID
2. **锁定阶段**：原子性更新这些记录为PROCESSING状态
   - 使用WHERE条件双重检查状态仍为PENDING
   - 只有成功更新的记录才会被当前实例处理

```typescript
// 1. 查询待处理记录
const pendingRecords = await prisma.apiCallRecord.findMany({
  where: { billStatus: 'PENDING' },
  take: 1000,
  select: { requestId: true },
});

// 2. 原子性锁定
const updateResult = await prisma.apiCallRecord.updateMany({
  where: {
    requestId: { in: requestIds },
    billStatus: 'PENDING', // 双重检查
  },
  data: { billStatus: 'PROCESSING' },
});

// 3. 只处理成功锁定的记录
```

## 错误处理

### 请求失败时的处理

- 记录错误信息到 errorMessage 字段
- cost 设为 0
- billStatus 直接设为 COMPLETED（无需扣费）

### 计费失败时的处理

- 将记录状态设为 FAILED
- 每30分钟重试一次
- 只重试48小时内的失败记录

## Token计算策略

### 优先级

1. **优先使用响应中的 usage 信息**

   - OpenAI API 通常会返回准确的 token 使用量
   - 直接使用 `response.usage.prompt_tokens` 和 `completion_tokens`

2. **备用 tiktoken 计算**
   - 当响应中没有 usage 信息时
   - 使用 tiktoken 库计算请求和响应的 token 数量
   - 支持文本和图片的 token 计算

### tiktoken 计算细节

- 文本：直接编码计算长度
- 图片：每 600x600 像素块计算 1000 tokens
- 消息格式：每条消息额外 3 tokens
- 工具调用：序列化后计算 token 数量

## 费用计算公式

```
费用 = inputPrice × inputTokens + outputPrice × outputTokens
```

- inputPrice/outputPrice: 每个token的价格（从ai_models表获取）
- 价格单位：建议使用最小货币单位（如：分）避免精度问题

## 监控与告警

1. **关键指标**

   - PENDING记录积压数量
   - FAILED记录数量
   - 平均处理延迟

2. **告警条件**
   - PENDING记录超过10000条
   - FAILED记录超过1000条
   - 处理延迟超过5分钟

## 优化建议

1. **缓存模型价格**：避免每次查询数据库
2. **使用Redis**：缓存用户余额，快速预检
3. **分片处理**：按walletId分片，提高并发度
4. **消息队列**：未来可考虑使用MQ替代定时任务

## 性能优化点

1. **异步记录**：使用 `setImmediate` 确保不阻塞响应
2. **批量处理**：减少数据库操作次数
3. **事务优化**：单机环境下使用大事务保证一致性
4. **索引优化**：在 billStatus 和 createdAt 上建立复合索引
