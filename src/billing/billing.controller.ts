import { Controller, Get, Query, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../identity/auth/auth.guard';
import { BillingService } from './billing.service';
import { PrismaService } from '../core/prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';

@ApiTags('Billing')
@Controller('billing')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
  ) {}

  /**
   * 获取钱包的消费记录列表
   */
  @Get('wallet/:walletUid/transactions')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['DEPOSIT', 'REFUND', 'REDEMPTION', 'API_CALL'],
  })
  async getWalletTransactions(
    @Param('walletUid') walletUid: string,
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('type') type?: string,
  ) {
    const userId = req.user.id;

    // 验证钱包访问权限
    const wallet = await this.walletService.getAuthorizedWallet(
      { uid: walletUid },
      userId,
    );

    // 构建查询条件
    const where: any = { walletId: wallet.id };
    if (type) {
      where.type = type;
    }

    // 查询消费记录
    const [transactions, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.walletTransaction.count({ where }),
    ]);

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 获取消费记录详情（针对 API_CALL 类型）
   */
  @Get('transaction/:transactionUid/detail')
  async getTransactionDetail(
    @Param('transactionUid') transactionUid: string,
    @Req() req: any,
  ) {
    const userId = req.user.id;

    // 查询交易记录
    const transaction = await this.prisma.walletTransaction.findUnique({
      where: { uid: transactionUid },
      include: { wallet: true },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // 验证访问权限
    await this.walletService.getAuthorizedWallet(
      { id: transaction.walletId },
      userId,
    );

    // 如果是 API_CALL 类型，查询详细信息
    let detail = null;
    if (transaction.type === 'API_CALL' && transaction.sourceId) {
      detail = await this.prisma.apiCallBilling.findUnique({
        where: { eventId: transaction.sourceId },
      });
    }

    return {
      transaction,
      detail,
    };
  }

  /**
   * 获取钱包的计费统计
   */
  @Get('wallet/:walletUid/stats')
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  async getWalletBillingStats(
    @Param('walletUid') walletUid: string,
    @Req() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userId = req.user.id;

    // 验证钱包访问权限
    const wallet = await this.walletService.getAuthorizedWallet(
      { uid: walletUid },
      userId,
    );

    const stats = await this.billingService.getWalletBillingStats(
      wallet.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );

    return stats;
  }
}
