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

## 计费流程

### 1. 记录创建（实时）

```typescript
// 请求完成后立即创建记录
await billingService.createBillingRecord({
  requestId: ulid(),
  model: 'gpt-4',
  inputTokens: 100,
  outputTokens: 200,
  // ...
});
```

### 2. 批量处理（定时任务，每分钟）

- 查询并锁定PENDING记录
- 按钱包分组
- 批量扣费
- 更新状态为COMPLETED

### 3. 失败重试（定时任务，每10分钟）

- 将FAILED记录重置为PENDING
- 只重试最近24小时内的记录

## Token计算时机

Token计算发生在请求完成时，而不是批量处理时：

1. **实时计算**（当前方案）

   - 优点：响应中包含usage信息时直接使用
   - 缺点：无usage信息时需要调用tiktoken

2. **延迟计算**（备选方案）
   - 优点：批量处理时统一计算，减少实时压力
   - 缺点：需要存储完整的请求/响应内容

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
