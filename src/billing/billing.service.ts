import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { UlidService } from '../core/ulid/ulid.service';
import { Cron } from '@nestjs/schedule';
import { Prisma } from '@prisma-client';
import type { ApiCallBillingUncheckedCreateInput } from '../../prisma/generated/models/ApiCallBilling';

// 基于 Prisma 生成的类型，但排除自动生成的字段
export type ApiCallData = Omit<
  ApiCallBillingUncheckedCreateInput,
  'id' | 'isBilled' | 'processedAt' | 'createdAt' | 'updatedAt'
>;

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ulidService: UlidService,
  ) {}

  /**
   * 记录API调用计费信息
   */
  async recordApiCall(data: ApiCallData) {
    try {
      const billing = await this.prisma.apiCallBilling.create({
        data: {
          eventId: data.eventId,
          userId: data.userId,
          walletId: data.walletId,
          model: data.model,
          inputToken: data.inputToken,
          outputToken: data.outputToken,
          cost: data.cost,
          status: data.status,
          durationMs: data.durationMs,
          timestamp: data.timestamp,
          isBilled: false,
          errorMessage: data.errorMessage,
          clientIp: data.clientIp || '0.0.0.0',
          externalTraceId: data.externalTraceId || '',
        },
      });

      this.logger.debug(`Recorded API call billing: ${billing.eventId}`);
      return billing;
    } catch (error) {
      // 如果是重复的eventId，忽略错误（幂等性）
      if (error.code === 'P2002') {
        this.logger.warn(`Duplicate eventId: ${data.eventId}`);
        return;
      }
      throw error;
    }
  }

  /**
   * 定时处理待计费记录（每分钟的第0秒执行）
   * Cron 表达式: 秒 分 时 日 月 周
   * "0 * * * * *" 表示每分钟的第0秒执行
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
   * 批量处理计费记录
   */
  private async processBillingBatch() {
    const batchSize = 1000;
    const cutoffTime = new Date(Date.now() - 5 * 60 * 1000); // 5分钟前

    // 查询待处理的计费记录
    const pendingBillings = await this.prisma.apiCallBilling.findMany({
      where: {
        isBilled: false,
        createdAt: { lte: cutoffTime },
        status: { gte: 20000, lt: 30000 }, // 只处理成功的请求
      },
      take: batchSize,
      orderBy: { createdAt: 'asc' },
    });

    if (pendingBillings.length === 0) {
      return;
    }

    this.logger.log(`Processing ${pendingBillings.length} billing records`);

    // 按钱包分组
    const billingsByWallet = this.groupBillingsByWallet(pendingBillings);

    // 处理每个钱包的计费
    for (const [walletId, billings] of Object.entries(billingsByWallet)) {
      await this.processWalletBillings(parseInt(walletId), billings);
    }
  }

  /**
   * 按钱包分组计费记录
   */
  private groupBillingsByWallet(billings: any[]): Record<string, any[]> {
    return billings.reduce(
      (groups, billing) => {
        const walletId = billing.walletId;
        if (!groups[walletId]) {
          groups[walletId] = [];
        }
        groups[walletId].push(billing);
        return groups;
      },
      {} as Record<string, any[]>,
    );
  }

  /**
   * 处理单个钱包的计费
   */
  private async processWalletBillings(walletId: number, billings: any[]) {
    try {
      // 计算总费用
      const totalCost = billings.reduce((sum, b) => sum + Number(b.cost), 0);

      if (totalCost === 0) {
        // 如果费用为0，只更新标记
        await this.prisma.apiCallBilling.updateMany({
          where: { id: { in: billings.map((b) => b.id) } },
          data: {
            isBilled: true,
            processedAt: new Date(),
          },
        });
        return;
      }

      // 使用事务处理计费
      await this.prisma.$transaction(async (tx) => {
        // 1. 为每个 ApiCallBilling 创建对应的 WalletTransaction
        const walletTransactions = [];
        for (const billing of billings) {
          if (Number(billing.cost) > 0) {
            const transaction = await tx.walletTransaction.create({
              data: {
                uid: this.ulidService.generate(),
                walletId: walletId,
                amount: new Prisma.Decimal(-Number(billing.cost)), // 负数表示扣费
                type: 'API_CALL',
                status: 'COMPLETED',
                description: `API call: ${billing.model}`,
                sourceId: billing.eventId, // 使用 eventId 作为 sourceId
              },
            });
            walletTransactions.push(transaction);
          }
        }

        // 2. 更新钱包余额（使用乐观锁）
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

        // 3. 标记计费记录为已处理
        await tx.apiCallBilling.updateMany({
          where: { id: { in: billings.map((b) => b.id) } },
          data: {
            isBilled: true,
            processedAt: new Date(),
          },
        });

        this.logger.log(
          `Processed ${billings.length} billings for wallet ${walletId}: ${totalCost} deducted`,
        );
      });
    } catch (error) {
      this.logger.error(
        `Failed to process wallet ${walletId} billing: ${error.message}`,
      );

      // 可以考虑将失败的记录标记为特殊状态，便于后续处理
      // 或者发送告警通知
    }
  }

  /**
   * 获取钱包的计费统计
   */
  async getWalletBillingStats(
    walletId: number,
    startDate?: Date,
    endDate?: Date,
  ) {
    const where: any = { walletId };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = startDate;
      if (endDate) where.timestamp.lte = endDate;
    }

    const stats = await this.prisma.apiCallBilling.aggregate({
      where,
      _sum: {
        cost: true,
        inputToken: true,
        outputToken: true,
      },
      _count: true,
    });

    return {
      totalCost: stats._sum.cost || 0,
      totalInputTokens: stats._sum.inputToken || 0,
      totalOutputTokens: stats._sum.outputToken || 0,
      totalRequests: stats._count,
    };
  }
}
