import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiCallRecord, BillStatus, User, Wallet } from '@prisma-client/client';
import { ApiCallRecordCreateInput } from '@prisma-client/models';
import { FeishuWebhookService } from 'src/core/feishu-webhook/feishu-webhook.service';
import {
  Decimal,
  TransactionClient,
} from '@prisma-client/internal/prismaNamespace';

type ApiCallRecordGroup = Pick<
  ApiCallRecord,
  'requestId' | 'walletId' | 'userId' | 'cost'
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
      await this.prisma.apiCallRecord.create({ data });
    } catch (error) {
      // 如果是重复的requestId，忽略错误（幂等性）
      if (error.code === 'P2002') {
        this.logger.warn(`Duplicate requestId: ${data.requestId}`);
        return;
      }

      // 其他错误，记录并抛出异常
      this.logger.error(`Failed to create billing record: ${error.message}`);
      this.feishuWebhookService
        .sendText('Failed to create billing record: ' + error)
        .catch();
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

  // 定时将 FAILED 的记录重置为 PENDING
  @Cron(CronExpression.EVERY_30_MINUTES)
  async retryFailedBillings() {
    const result = await this.prisma.apiCallRecord.updateMany({
      where: { billStatus: BillStatus.FAILED },
      data: { billStatus: BillStatus.PENDING },
    });

    if (result.count > 0) {
      this.logger.log(`${result.count} failed records reset to PENDING`);
    }
  }

  // 批量处理未计费的记录
  private async processBillingBatch(): Promise<number> {
    const batchSize = 2000; // 每次处理2000条记录
    const cutoffTime = new Date(Date.now() - 10 * 1000); // 10秒前，避免处理正在进行的请求

    const needUpdateCreditLimit = new Map<Wallet['id'], Set<User['id']>>();

    // 使用事务来保证原子性
    return await this.prisma.$transaction(async (tx) => {
      // 1. 查询并锁定待处理的记录
      const pendingRecords = await tx.apiCallRecord.findMany({
        where: {
          billStatus: BillStatus.PENDING,
          createdAt: { lte: cutoffTime },
        },
        take: batchSize,
        select: { requestId: true, walletId: true, userId: true, cost: true }, // 只查询必要的字段，避免不必要的开销
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

      // 3. 按钱包和用户双重分组
      const groupedRecords = this.groupRecordsByWalletAndUser(pendingRecords);

      // 4. 处理每个钱包的记录（仍在事务中）
      let processedCount = 0;
      for (const [walletId, walletUserRecords] of Object.entries(
        groupedRecords,
      )) {
        try {
          await this.processWalletBillingInTx(
            tx,
            parseInt(walletId),
            walletUserRecords,
          );

          // 计算成功处理的记录数
          const recordCount = Object.values(walletUserRecords).reduce(
            (total, userRecords) => total + userRecords.length,
            0,
          );
          processedCount += recordCount;

          // 收集成功处理的 walletId 和 userIds
          if (!needUpdateCreditLimit.has(parseInt(walletId))) {
            needUpdateCreditLimit.set(parseInt(walletId), new Set());
          }
          const userIds = Object.keys(walletUserRecords).map(Number);
          userIds.forEach((userId) =>
            needUpdateCreditLimit.get(parseInt(walletId))!.add(userId),
          );
        } catch (error) {
          // 单个钱包失败不影响其他钱包
          this.logger.error(
            `wallet ${walletId} failed to process, error: ${error.message}`,
          );

          // 收集所有失败的记录ID
          const failedRequestIds = Object.values(walletUserRecords)
            .flat()
            .map((r) => r.requestId);

          // 将失败的记录标记为FAILED
          await tx.apiCallRecord.updateMany({
            where: { requestId: { in: failedRequestIds } },
            data: { billStatus: BillStatus.FAILED },
          });
        }
      }
      return processedCount;
    });
  }

  // 按钱包和用户双重分组记录
  private groupRecordsByWalletAndUser(records: ApiCallRecordGroup[]) {
    return records.reduce(
      (group, r) => {
        const { walletId, userId } = r;

        if (!group[walletId]) {
          group[walletId] = {};
        }
        if (!group[walletId][userId]) {
          group[walletId][userId] = [];
        }
        group[walletId][userId].push(r);
        return group;
      },
      {} as Record<Wallet['id'], Record<User['id'], ApiCallRecordGroup[]>>,
    );
  }

  // 在事务中处理单个钱包的计费（分开算的实现）
  private async processWalletBillingInTx(
    tx: TransactionClient,
    walletId: Wallet['id'],
    recordsByUser: Record<User['id'], ApiCallRecordGroup[]>,
  ) {
    // 第一步：计算总费用和收集所有记录ID
    const { totalCost, allRequestIds } = this.calculateTotalCost(recordsByUser);

    // 如果费用为0，只更新状态
    if (totalCost.equals(0)) {
      await tx.apiCallRecord.updateMany({
        where: { requestId: { in: allRequestIds } },
        data: { billStatus: BillStatus.COMPLETED },
      });
      return;
    }

    // 第二步：扣减钱包余额（使用乐观锁）
    await this.deductWalletBalance(tx, walletId, totalCost);

    // 第三步：更新每个用户的creditUsed
    await this.updateUserCreditUsed(tx, walletId, recordsByUser);

    // 第四步：更新记录状态为已计费
    await tx.apiCallRecord.updateMany({
      where: { requestId: { in: allRequestIds } },
      data: { billStatus: BillStatus.COMPLETED },
    });

    this.logger.log(
      `Wallet ${walletId}: deducted ${totalCost}, updated creditUsed for ${Object.keys(recordsByUser).length} users`,
    );
  }

  // 计算总费用和收集记录ID
  private calculateTotalCost(
    recordsByUser: Record<User['id'], ApiCallRecordGroup[]>,
  ) {
    let totalCost = new Decimal(0);
    const allRequestIds: string[] = [];

    for (const userRecords of Object.values(recordsByUser)) {
      userRecords.forEach((r) => {
        totalCost = totalCost.plus(r.cost);
        allRequestIds.push(r.requestId);
      });
    }

    return { totalCost, allRequestIds };
  }

  // 扣减钱包余额
  private async deductWalletBalance(
    tx: TransactionClient,
    walletId: Wallet['id'],
    totalCost: Decimal,
  ) {
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
  }

  // 更新用户creditUsed
  private async updateUserCreditUsed(
    tx: TransactionClient,
    walletId: Wallet['id'],
    recordsByUser: Record<User['id'], ApiCallRecordGroup[]>,
  ) {
    for (const [userId, userRecords] of Object.entries(recordsByUser)) {
      // 计算该用户的总费用
      let userCost = new Decimal(0);
      userRecords.forEach((r) => {
        userCost = userCost.plus(r.cost);
      });

      // 只有费用大于0的用户才需要更新creditUsed
      if (userCost.greaterThan(0)) {
        await tx.walletMember.updateMany({
          where: {
            walletId,
            userId: parseInt(userId),
            isActive: true,
          },
          data: {
            creditUsed: { increment: userCost },
          },
        });
      }
    }
  }
}
