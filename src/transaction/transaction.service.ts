import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Transaction, User, Wallet } from '@prisma-main-client/client';
import { FeishuWebhookService } from 'src/core/feishu-webhook/feishu-webhook.service';
import {
  Decimal,
  TransactionClient,
} from '@prisma-main-client/internal/prismaNamespace';
import { PrismaService } from '../core/prisma/prisma.service';
import { TransactionStatus, TransactionType } from '@prisma-main-client/enums';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { WalletService } from '../wallet/wallet.service';
import {
  SelfTransactionQueryDto,
  TransactionDetailData,
  TransactionListData,
  WalletTransactionQueryDto,
} from './dto/transaction-query.dto';
import {
  TRANSACTION_QUERY_APIKEY_SELECT,
  TRANSACTION_QUERY_OMIT,
  TRANSACTION_QUERY_USER_SELECT,
} from 'prisma/main/query.constant';

type TransactionGroup = Pick<
  Transaction,
  'businessId' | 'walletId' | 'userId' | 'amount'
>;

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
    private readonly feishuWebhookService: FeishuWebhookService,
  ) {}

  // ==================== 查询方法 ====================

  /**
   * 查询用户自己的交易记录
   */
  async getSelfTransactions(
    userId: User['id'],
    query: SelfTransactionQueryDto,
  ): Promise<TransactionListData> {
    const { page = 1, pageSize = 20 } = query;
    const where = this.buildTransactionWhere({ ...query, userId });

    const [records, total] = await Promise.all([
      this.prisma.main.transaction.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'desc' },
        omit: TRANSACTION_QUERY_OMIT,
        include: {
          apiKey: {
            select: TRANSACTION_QUERY_APIKEY_SELECT,
          },
        },
      }),
      this.prisma.main.transaction.count({ where }),
    ]);

    return this.formatTransactionListResponse(records, total, page, pageSize);
  }

  /**
   * 查询钱包的交易记录（仅钱包所有者）
   */
  async getWalletTransactions(
    requestUserId: User['id'],
    walletUid: string,
    query: WalletTransactionQueryDto,
  ): Promise<TransactionListData> {
    // 验证钱包所有权
    const wallet = await this.walletService.getAccessibleWallet(
      { uid: walletUid },
      requestUserId,
      true,
    );

    const { page = 1, pageSize = 20 } = query;
    const where = this.buildTransactionWhere({ ...query, walletId: wallet.id });

    const [records, total] = await Promise.all([
      this.prisma.main.transaction.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'desc' },
        omit: TRANSACTION_QUERY_OMIT,
        include: {
          user: {
            select: TRANSACTION_QUERY_USER_SELECT,
          },
          apiKey: {
            select: TRANSACTION_QUERY_APIKEY_SELECT,
          },
        },
      }),
      this.prisma.main.transaction.count({ where }),
    ]);

    return this.formatTransactionListResponse(records, total, page, pageSize);
  }

  /**
   * 查询交易详情
   */
  async getTransactionDetail(
    requestUserId: User['id'],
    businessId: string,
  ): Promise<TransactionDetailData> {
    // 查询ApiCallRecord记录
    const record = await this.prisma.detail.apiCallRecord.findUnique({
      where: { businessId },
    });

    if (!record) {
      throw new BusinessException('交易记录不存在');
    }

    // 权限检查：用户本人或钱包所有者
    const isOwner = record.userId === requestUserId;
    if (!isOwner) {
      // 检查是否为钱包所有者
      await this.walletService.getAccessibleWallet(
        { id: record.walletId },
        requestUserId,
        true,
      );
    }

    // 排除敏感数据后返回
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, userId, walletId, apiKeyId, ...safeData } = record;
    return safeData as TransactionDetailData;
  }

  // ==================== 辅助方法 ====================

  /**
   * 构建查询条件
   */
  private buildTransactionWhere(params: {
    userId?: number;
    walletId?: number;
    startDate?: string;
    endDate?: string;
    type?: TransactionType;
    status?: TransactionStatus;
  }) {
    const where: any = {};

    if (params.userId) {
      where.userId = params.userId;
    }

    if (params.walletId) {
      where.walletId = params.walletId;
    }

    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) {
        where.createdAt.gte = new Date(params.startDate);
      }
      if (params.endDate) {
        where.createdAt.lte = new Date(params.endDate + 'T23:59:59.999Z');
      }
    }

    if (params.type) {
      where.type = params.type;
    }

    if (params.status) {
      where.status = params.status;
    }

    return where;
  }

  /**
   * 格式化交易列表响应
   */
  private formatTransactionListResponse(
    records: any[],
    total: number,
    page: number,
    pageSize: number,
  ): TransactionListData {
    return {
      records, // 直接返回，让前端处理格式化
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // ==================== 计费处理方法 ====================

  // 定时批量处理计费（每整分钟执行）
  @Cron('0 * * * * *')
  protected async _processPendingTransactions() {
    this.logger.log('Starting transaction processing');

    try {
      const processed = await this.processTransactionBatch();

      if (processed > 0) {
        this.logger.log(`${processed} records processed`);
      }
    } catch (error) {
      this.logger.error(`Transaction processing error: ${error.message}`);
    }
  }

  // 定时将 FAILED 的记录重置为 PENDING
  @Cron(CronExpression.EVERY_30_MINUTES)
  protected async _retryFailedTransactions() {
    const result = await this.prisma.main.transaction.updateMany({
      where: {
        status: TransactionStatus.FAILED,
        type: TransactionType.CONSUME,
      },
      data: { status: TransactionStatus.PENDING },
    });

    if (result.count > 0) {
      this.feishuWebhookService
        .sendText(`${result.count} failed records reset to PENDING`)
        .catch();
      this.logger.log(`${result.count} failed records reset to PENDING`);
    } else {
      this.logger.log('No failed records found');
    }
  }

  // 批量处理未计费的记录
  private async processTransactionBatch(): Promise<number> {
    const batchSize = 2000; // 每次处理2000条记录
    const cutoffTime = new Date(Date.now() - 10 * 1000); // 10秒前，避免处理正在进行的请求

    const needUpdateCreditLimit = new Map<Wallet['id'], Set<User['id']>>();

    // 使用事务来保证原子性
    return await this.prisma.main.$transaction(async (tx) => {
      // 1. 查询并锁定待处理的记录
      const pendingRecords = await tx.transaction.findMany({
        where: {
          status: TransactionStatus.PENDING,
          type: TransactionType.CONSUME,
          createdAt: { lte: cutoffTime },
        },
        take: batchSize,
        select: {
          businessId: true,
          walletId: true,
          userId: true,
          amount: true,
        }, // 只查询必要的字段，避免不必要的开销
        orderBy: { createdAt: 'asc' }, // 按创建时间排序，确保幂等性
      });

      this.logger.log(`${pendingRecords.length} records found`);

      // 如果未找到记录，直接返回0
      if (pendingRecords.length === 0) {
        this.logger.log('No records found, skip');
        return 0;
      }

      // 2. 立即标记为处理中（在同一事务中）
      const businessIds = pendingRecords.map((r) => r.businessId);
      await tx.transaction.updateMany({
        where: { businessId: { in: businessIds } },
        data: { status: TransactionStatus.PROCESSING },
      });

      // 3. 按钱包和用户双重分组
      const groupedRecords = this.groupRecordsByWalletAndUser(pendingRecords);

      // 4. 处理每个钱包的记录（仍在事务中）
      let processedCount = 0;
      for (const [walletId, walletUserRecords] of Object.entries(
        groupedRecords,
      )) {
        try {
          await this.processWalletTransactionInTx(
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
          const failedBusinessIds = Object.values(walletUserRecords)
            .flat()
            .map((r) => r.businessId);

          // 将失败的记录标记为FAILED
          await tx.transaction.updateMany({
            where: { businessId: { in: failedBusinessIds } },
            data: { status: TransactionStatus.FAILED },
          });
        }
      }
      return processedCount;
    });
  }

  // 按钱包和用户双重分组记录
  private groupRecordsByWalletAndUser(records: TransactionGroup[]) {
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
      {} as Record<Wallet['id'], Record<User['id'], TransactionGroup[]>>,
    );
  }

  // 在事务中处理单个钱包的计费（分开算的实现）
  private async processWalletTransactionInTx(
    tx: TransactionClient,
    walletId: Wallet['id'],
    recordsByUser: Record<User['id'], TransactionGroup[]>,
  ) {
    // 第一步：计算总费用和收集所有记录ID
    const { totalCost, allBusinessIds } =
      this.calculateTotalCost(recordsByUser);

    // 如果费用为0，只更新状态
    if (totalCost.equals(0)) {
      await tx.transaction.updateMany({
        where: { businessId: { in: allBusinessIds } },
        data: { status: TransactionStatus.COMPLETED },
      });
      return;
    }

    // 第二步：扣减钱包余额（使用乐观锁）
    await this.deductWalletBalance(tx, walletId, totalCost);

    // 第三步：更新每个用户的creditUsed
    await this.updateUserCreditUsed(tx, walletId, recordsByUser);

    // 第四步：更新记录状态为已计费
    await tx.transaction.updateMany({
      where: { businessId: { in: allBusinessIds } },
      data: { status: TransactionStatus.COMPLETED },
    });

    this.logger.log(
      `Wallet ${walletId}: deducted ${totalCost}, updated creditUsed for ${Object.keys(recordsByUser).length} users`,
    );
  }

  // 计算总费用和收集记录ID
  private calculateTotalCost(
    recordsByUser: Record<User['id'], TransactionGroup[]>,
  ) {
    let totalCost = new Decimal(0);
    const allBusinessIds: string[] = [];

    for (const userRecords of Object.values(recordsByUser)) {
      userRecords.forEach((r) => {
        totalCost = totalCost.plus(r.amount);
        allBusinessIds.push(r.businessId);
      });
    }

    return { totalCost, allBusinessIds };
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
    recordsByUser: Record<User['id'], TransactionGroup[]>,
  ) {
    for (const [userId, userRecords] of Object.entries(recordsByUser)) {
      // 计算该用户的总费用
      let userCost = new Decimal(0);
      userRecords.forEach((r) => {
        userCost = userCost.plus(r.amount);
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
