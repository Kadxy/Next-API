import { Controller, Get, Query, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../identity/auth/auth.guard';
import { BillingService } from './billing.service';
import { WalletService } from '../wallet/wallet.service';

@ApiTags('Billing')
@Controller('billing')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly walletService: WalletService,
  ) {}

  /**
   * 获取钱包的API调用记录
   */
  @Get('wallet/:walletUid/api-calls')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  async getWalletApiCallHistory(
    @Param('walletUid') walletUid: string,
    @Req() req: any,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userId = req.user.id;

    // 验证钱包访问权限
    const wallet = await this.walletService.getAuthorizedWallet(
      { uid: walletUid },
      userId,
    );

    return this.billingService.getWalletApiCallHistory(wallet.id, {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 20,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  /**
   * 获取单个API调用记录详情
   */
  @Get('api-call/:requestId')
  async getApiCallDetail(
    @Param('requestId') requestId: string,
    @Req() req: any,
  ) {
    const userId = req.user.id;

    // 获取 API 调用记录
    const apiCallRecord = await this.billingService.getApiCallRecord(requestId);

    if (!apiCallRecord) {
      throw new Error('API call record not found');
    }

    // 验证访问权限
    await this.walletService.getAuthorizedWallet(
      { id: apiCallRecord.walletId },
      userId,
    );

    return apiCallRecord;
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
