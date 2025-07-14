import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma-mysql-client/client';
import { PrismaService } from '../core/prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { UserService } from '../identity/user/user.service';
import { QueryBillingLogsDto } from './dto/billing-log.dto';
import { API_CALL_RECORD_LIST_SELECT } from 'prisma/mysql/query.constant';
import { BusinessException } from '../common/exceptions';

@Injectable()
export class BillingLogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
    private readonly userService: UserService,
  ) {}

  async querySelfBillingLogs(userId: User['id'], query: QueryBillingLogsDto) {
    const where: Prisma.ApiCallRecordWhereInput = {
      userId,
    };

    // 应用筛选条件
    this.applyFilters(where, query);

    return this.executeQuery(where, query);
  }

  async queryWalletBillingLogs(
    userId: User['id'],
    walletUid: string,
    query: QueryBillingLogsDto,
  ) {
    // 验证钱包访问权限
    const wallet = await this.walletService.getAccessibleWallet(
      { uid: walletUid },
      userId,
    );

    const where: Prisma.ApiCallRecordWhereInput = {
      walletId: wallet.id,
    };

    // 如果是钱包owner
    if (wallet.ownerId === userId) {
      // 可以查询特定成员
      if (query.memberUid) {
        const member = await this.userService.getCachedUser(query.memberUid);
        if (!member) {
          throw new BusinessException('Member not found');
        }
        where.userId = member.id;
      }
      // 否则查询整个钱包的记录
    } else {
      // 普通成员只能查询自己的记录
      where.userId = userId;
    }

    // 应用筛选条件
    this.applyFilters(where, query);

    return this.executeQuery(where, query);
  }

  async getBillingLogDetail(requestId: string, userId: User['id']) {
    // 从 pg 查询详细日志
    const detailLog = await this.prisma.postgresql.apiCallLog.findUnique({
      where: { requestId },
      select: {
        requestId: true,
        walletUid: true,
        userUid: true,
        userId: true,
        ownerUid: true,
        ownerId: true,
        apiKeyPreview: true,
        requestHeaders: true,
        requestBody: true,
        responseHeaders: true,
        responseBody: true,
        responseStream: true,
        createdAt: true,
      },
    });

    if (!detailLog) {
      throw new BusinessException('Log not found');
    }

    // 验证权限：用户必须是记录的所有者或钱包的owner
    if (detailLog.userId !== userId && detailLog.ownerId !== userId) {
      throw new BusinessException('Permission denied');
    }

    // 返回详细日志（omit掉权限验证用的ID字段）
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId: _, ownerId: __, ...logWithoutIds } = detailLog;
    return logWithoutIds;
  }

  /**
   * 应用查询筛选条件
   */
  private applyFilters(
    where: Prisma.ApiCallRecordWhereInput,
    query: QueryBillingLogsDto,
  ) {
    const { model, startTime, endTime, billStatus } = query;

    if (model) {
      where.model = model;
    }

    if (billStatus) {
      where.billStatus = billStatus;
    }

    if (startTime || endTime) {
      where.startTime = {};
      if (startTime) {
        where.startTime.gte = new Date(startTime);
      }
      if (endTime) {
        where.startTime.lte = new Date(endTime);
      }
    }
  }

  /**
   * 执行查询并返回格式化结果
   */
  private async executeQuery(
    where: Prisma.ApiCallRecordWhereInput,
    query: QueryBillingLogsDto,
  ) {
    const { page = 1, pageSize = 20 } = query;

    // 执行查询
    const [records, total] = await Promise.all([
      this.prisma.mysql.apiCallRecord.findMany({
        where,
        select: {
          ...API_CALL_RECORD_LIST_SELECT,
          userId: true, // 添加 userId 到查询中
        },
        orderBy: { startTime: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.mysql.apiCallRecord.count({ where }),
    ]);

    // 获取用户UID映射
    const userIds = [...new Set(records.map((r) => r.userId))];
    const users = await this.prisma.mysql.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, uid: true },
    });
    const userUidMap = new Map(users.map((u) => [u.id, u.uid]));

    // 转换结果
    const items = records.map((record) => ({
      requestId: record.requestId,
      walletUid: record.wallet.uid,
      userUid: userUidMap.get(record.userId) || '',
      model: record.model,
      startTime: record.startTime,
      endTime: record.endTime,
      durationMs: record.durationMs,
      inputToken: record.inputToken,
      outputToken: record.outputToken,
      cost: record.cost.toString(),
      billStatus: record.billStatus,
      errorMessage: record.errorMessage,
      createdAt: record.createdAt,
    }));

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
