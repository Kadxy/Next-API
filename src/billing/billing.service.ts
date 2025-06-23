import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiCallRecord, BillStatus, Wallet } from '@prisma-client';
import { BillingContext } from './dto/billing-context';
import { ApiCallRecordCreateInput } from '@prisma-client/models';
import { FeishuWebhookService } from 'src/core/feishu-webhook/feishu-webhook.service';
import {
  Decimal,
  TransactionClient,
} from '@prisma-client/internal/prismaNamespace';

type ApiCallRecordGroup = Pick<
  ApiCallRecord,
  'requestId' | 'walletId' | 'cost'
>;

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly feishuWebhookService: FeishuWebhookService,
  ) {}

  // 创建计费记录
  async createBillingRecord(data: ApiCallRecordCreateInput): Promise<void> {
    try {
      // 创建记录
      await this.prisma.apiCallRecord.create({ data });
    } catch (error) {
      // 如果是重复的requestId，忽略错误（幂等性）
      if (error.code === 'P2002') {
        this.logger.warn(`Duplicate requestId: ${data.requestId}`);
        return;
      }
      this.feishuWebhookService.sendText(
        'Failed to create billing record: ' + error,
      );
      this.logger.error(`Failed to create billing record: ${error.message}`);
      throw error;
    }
  }

  // 定时批量处理计费（每整分钟执行）
  @Cron('0 * * * * *')
  async processPendingBillings() {
    this.logger.log('Starting billing processing');

    try {
      const processed = await this.processBillingBatch();

      if (processed > 0) {
        this.logger.log(`${processed} records processed`);
      }
    } catch (error) {
      this.logger.error(`Billing processing error: ${error.message}`);
    }
  }

  // 定时重试 48小时内的失败的计费记录（每 30 分钟执行）
  @Cron(CronExpression.EVERY_30_MINUTES)
  async retryFailedBillings() {
    const cutoffTime = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const result = await this.prisma.apiCallRecord.updateMany({
      where: {
        billStatus: BillStatus.FAILED,
        createdAt: { gte: cutoffTime },
      },
      data: {
        billStatus: BillStatus.PENDING,
      },
    });

    if (result.count > 0) {
      this.logger.log(`${result.count} failed records reset to PENDING`);
    }
  }

  // 批量处理未计费的记录
  private async processBillingBatch(): Promise<number> {
    const batchSize = 1000; // 每次处理1000条记录
    const cutoffTime = new Date(Date.now() - 10 * 1000); // 10秒前，避免处理正在进行的请求

    // 使用事务来保证原子性
    return await this.prisma.$transaction(async (tx) => {
      // 1. 查询并锁定待处理的记录
      const pendingRecords = await tx.apiCallRecord.findMany({
        where: {
          billStatus: BillStatus.PENDING,
          createdAt: { lte: cutoffTime },
        },
        take: batchSize,
        select: { requestId: true, walletId: true, cost: true }, // 只查询必要的字段，避免不必要的开销
        orderBy: { createdAt: 'asc' }, // 按创建时间排序，确保幂等性
      });

      this.logger.log(`${pendingRecords.length} records found`);

      // 如果未找到记录，直接返回0
      if (pendingRecords.length === 0) {
        this.logger.log('No records found, skip');
        return 0;
      }

      // 2. 立即标记为处理中（在同一事务中）
      const requestIds = pendingRecords.map((r) => r.requestId);
      await tx.apiCallRecord.updateMany({
        where: { requestId: { in: requestIds } },
        data: { billStatus: BillStatus.PROCESSING },
      });

      // 3. 按钱包分组
      const recordsByWallet = this.groupRecordsByWallet(pendingRecords);

      // 4. 处理每个钱包的记录（仍在事务中）
      let successCount = 0;
      for (const [walletId, records] of Object.entries(recordsByWallet)) {
        try {
          await this.processWalletBillingInTx(tx, parseInt(walletId), records);
          successCount += records.length;
        } catch (error) {
          // 单个钱包失败不影响其他钱包
          this.logger.error(
            `wallet ${walletId} failed to process, error: ${error.message}`,
          );

          // 将失败的记录标记为FAILED
          await tx.apiCallRecord.updateMany({
            where: { requestId: { in: records.map((r) => r.requestId) } },
            data: { billStatus: BillStatus.FAILED },
          });
        }
      }

      return successCount;
    });
  }
  // 按钱包分组记录
  private groupRecordsByWallet(records: ApiCallRecordGroup[]) {
    return records.reduce(
      (g, r) => {
        const walletId = r.walletId;
        if (!g[walletId]) {
          g[walletId] = [];
        }
        g[walletId].push(r);
        return g;
      },
      {} as Record<Wallet['id'], ApiCallRecordGroup[]>,
    );
  }

  // 在事务中处理单个钱包的计费
  private async processWalletBillingInTx(
    tx: TransactionClient,
    walletId: Wallet['id'],
    records: ApiCallRecordGroup[],
  ) {
    // 计算总费用
    let totalCost = new Decimal(0);
    records.forEach((r) => (totalCost = totalCost.plus(r.cost)));

    // 如果费用为0，只更新状态
    if (totalCost.equals(0)) {
      await tx.apiCallRecord.updateMany({
        where: { requestId: { in: records.map((r) => r.requestId) } },
        data: { billStatus: BillStatus.COMPLETED },
      });
      return;
    }

    // 扣减钱包余额（使用乐观锁）
    const updateResult = await tx.wallet.updateMany({
      where: { id: walletId },
      data: {
        balance: { decrement: totalCost },
        version: { increment: 1 },
      },
    });

    if (updateResult.count === 0) {
      throw new Error(`Version conflict for wallet ${walletId}`);
    }

    // 更新记录状态为已计费
    await tx.apiCallRecord.updateMany({
      where: { requestId: { in: records.map((r) => r.requestId) } },
      data: { billStatus: BillStatus.COMPLETED },
    });

    this.logger.log(`Wallet ${walletId}: deducted ${totalCost}`);
  }

  // [ADMIN] 获取计费统计信息（用于监控）
  async getBillingStats() {
    const [pending, processing, failed] = await Promise.all([
      this.prisma.apiCallRecord.count({
        where: { billStatus: BillStatus.PENDING },
      }),
      this.prisma.apiCallRecord.count({
        where: { billStatus: BillStatus.PROCESSING },
      }),
      this.prisma.apiCallRecord.count({
        where: {
          billStatus: BillStatus.FAILED,
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      pending,
      processing,
      failed,
    };
  }
}
