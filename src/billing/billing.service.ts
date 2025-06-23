import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { UlidService } from '../core/ulid/ulid.service';
import { Cron } from '@nestjs/schedule';
import { Prisma } from '@prisma-client';
import {
  TiktokenService,
  OpenAIRequest,
} from '../billing/tiktoken/tiktoken.service';
import { BillingContext } from './dto/billing-context';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tiktokenService: TiktokenService,
  ) {}

  // 记录API调用并计算费用（单表写入）
  async recordApiCall(billingContext: BillingContext) {
    try {
      // 1. 计算token和费用
      const billingResult = await this.calculateBilling(billingContext);

      // 2. 写入 ApiCallRecord（包含所有信息）
      await this.prisma.apiCallRecord.create({
        data: {
          requestId: rawData.eventId,
          walletId: rawData.walletId,
          userId: rawData.userId,
          model: rawData.model,
          startTime: rawData.startTime,
          endTime: rawData.endTime,
          durationMs: rawData.endTime
            ? rawData.endTime.getTime() - rawData.startTime.getTime()
            : 0,
          isSuccess: rawData.status < 40000,
          errorMessage: rawData.errorMessage,
          inputToken: billingResult.inputTokens,
          outputToken: billingResult.outputTokens,
          clientIp: rawData.clientIp || '0.0.0.0',
          externalTraceId: rawData.externalTraceId || '',
          // 计费信息
          amount: new Prisma.Decimal(billingResult.cost),
          isBilled: false, // 初始状态：未计费
          billedAt: null,
          billingError: null,
        },
      });

      this.logger.debug(
        `Recorded API call: ${rawData.eventId}, cost: ${billingResult.cost}`,
      );
    } catch (error) {
      // 如果是重复的requestId，忽略错误（幂等性）
      if (error.code === 'P2002') {
        this.logger.warn(`Duplicate requestId: ${rawData.eventId}`);
        return;
      }
      this.logger.error(`Failed to record API call: ${error.message}`);
      throw error;
    }
  }

  /**
   * 计算计费信息
   */
  private async calculateBilling(billingContext: BillingContext): Promise<{
    inputTokens: number;
    outputTokens: number;
    cost: number;
  }> {
    let inputTokens = 0;
    let outputTokens = 0;
    let cost = 0;

    try {
      // 获取模型信息
      const model = await this.prisma.aIModel.findUnique({
        where: { name: billingContext.model, isActive: true },
      });

      if (!model) {
        this.logger.warn(
          `Model ${billingContext.model} not found, using default pricing`,
        );
        return { inputTokens: 0, outputTokens: 0, cost: 0 };
      }

      // 如果是失败请求或没有响应体，返回零费用
      if (billingContext.errorMessage || !billingContext.responseText) {
        return { inputTokens: 0, outputTokens: 0, cost: 0 };
      }

      // 优先使用响应中的usage信息
      if (billingContext.responseText.usage) {
        inputTokens = billingContext.responseText.usage.prompt_tokens || 0;
        outputTokens = billingContext.responseText.usage.completion_tokens || 0;
      } else {
        // 使用tiktoken计算
        const tokenResult =
          await this.calculateTokensWithTiktoken(billingContext);
        inputTokens = tokenResult.inputTokens;
        outputTokens = tokenResult.outputTokens;
      }

      // 计算费用
      const inputCost = (inputTokens / 1000) * Number(model.inputPrice);
      const outputCost = (outputTokens / 1000) * Number(model.outputPrice);
      cost = inputCost + outputCost;

      return { inputTokens, outputTokens, cost };
    } catch (error) {
      this.logger.error(`Error calculating billing: ${error.message}`);
      return { inputTokens: 0, outputTokens: 0, cost: 0 };
    }
  }

  /**
   * 使用tiktoken计算token数量
   */
  private async calculateTokensWithTiktoken(
    billingContext: BillingContext,
  ): Promise<{
    inputTokens: number;
    outputTokens: number;
  }> {
    try {
      // 构造输入请求
      const openAIRequest: OpenAIRequest = {
        messages: billingContext.requestBody.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          name: msg.name,
        })),
        tools: billingContext.requestBody.tools,
      };

      // 构造输出文本
      let outputText = '';
      if (billingContext.responseText?.choices) {
        outputText = billingContext.responseText.choices
          .map((choice) => choice.message?.content || choice.text || '')
          .join('\n');
      }

      const result = await this.tiktokenService.countTokens(
        openAIRequest,
        outputText,
      );
      return {
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
      };
    } catch (error) {
      this.logger.warn(
        `Failed to calculate tokens with tiktoken: ${error.message}`,
      );
      return { inputTokens: 0, outputTokens: 0 };
    }
  }

  /**
   * 定时批量处理计费（每分钟执行）
   */
  @Cron('0 * * * * *')
  async processPendingBillings() {
    const now = new Date();
    this.logger.debug(`Starting billing processing at ${now.toISOString()}`);

    try {
      await this.processBillingBatch();
    } catch (error) {
      this.logger.error(
        `Billing processing error: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * 批量处理未计费的记录
   */
  private async processBillingBatch() {
    const batchSize = 1000;
    const cutoffTime = new Date(Date.now() - 30 * 1000); // 30秒前，避免处理正在进行的请求

    // 查询未计费的记录
    const unbilledRecords = await this.prisma.apiCallRecord.findMany({
      where: {
        isBilled: false,
        amount: { gt: 0 }, // 只处理有费用的记录
        createdAt: { lte: cutoffTime },
      },
      take: batchSize,
      orderBy: { createdAt: 'asc' },
      select: {
        requestId: true,
        walletId: true,
        amount: true,
      },
    });

    if (unbilledRecords.length === 0) {
      return;
    }

    this.logger.log(`Processing ${unbilledRecords.length} unbilled records`);

    // 按钱包分组
    const recordsByWallet = this.groupRecordsByWallet(unbilledRecords);

    // 处理每个钱包的记录
    for (const [walletId, records] of Object.entries(recordsByWallet)) {
      await this.processWalletBilling(parseInt(walletId), records);
    }
  }

  /**
   * 按钱包分组记录
   */
  private groupRecordsByWallet(records: any[]): Record<string, any[]> {
    return records.reduce(
      (groups, record) => {
        const walletId = record.walletId;
        if (!groups[walletId]) {
          groups[walletId] = [];
        }
        groups[walletId].push(record);
        return groups;
      },
      {} as Record<string, any[]>,
    );
  }

  /**
   * 处理单个钱包的计费
   */
  private async processWalletBilling(walletId: number, records: any[]) {
    try {
      // 计算总费用
      const totalCost = records.reduce((sum, r) => sum + Number(r.amount), 0);

      if (totalCost === 0) {
        // 如果费用为0，只更新状态
        await this.prisma.apiCallRecord.updateMany({
          where: { requestId: { in: records.map((r) => r.requestId) } },
          data: {
            isBilled: true,
            billedAt: new Date(),
          },
        });
        return;
      }

      // 使用事务处理扣费
      await this.prisma.$transaction(async (tx) => {
        // 1. 更新钱包余额（使用乐观锁）
        const updateResult = await tx.wallet.updateMany({
          where: {
            id: walletId,
            balance: { gte: totalCost }, // 确保余额足够
          },
          data: {
            balance: { decrement: totalCost },
            version: { increment: 1 },
          },
        });

        if (updateResult.count === 0) {
          // 余额不足或版本冲突，回滚事务
          throw new Error(
            `Insufficient balance or version conflict for wallet ${walletId}`,
          );
        }

        // 2. 更新记录状态为已计费
        await tx.apiCallRecord.updateMany({
          where: { requestId: { in: records.map((r) => r.requestId) } },
          data: {
            isBilled: true,
            billedAt: new Date(),
          },
        });

        this.logger.log(
          `Processed ${records.length} records for wallet ${walletId}: ${totalCost} deducted`,
        );
      });
    } catch (error) {
      this.logger.error(
        `Failed to process wallet ${walletId} billing: ${error.message}`,
      );

      // 标记失败的记录
      await this.prisma.apiCallRecord
        .updateMany({
          where: { requestId: { in: records.map((r) => r.requestId) } },
          data: {
            billingError: error.message,
          },
        })
        .catch((err) => {
          this.logger.error(`Failed to mark records as failed: ${err.message}`);
        });
    }
  }
}
