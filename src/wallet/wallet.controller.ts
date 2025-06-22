import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard, RequestWithUser } from 'src/identity/auth/auth.guard';
import {
  AddMemberDto,
  ListWalletResponseDto,
  UpdateMemberDto,
  WalletDetailResponseDto,
} from './dto/wallet.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/interceptors/transform.interceptor';
import { BillingService } from '../billing/billing.service';
import { BusinessException } from 'src/common/exceptions/business.exception';

@Controller('wallets')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly billingService: BillingService,
  ) {}

  @Get()
  @ApiOperation({ summary: '获取用户可访问的钱包列表' })
  @ApiResponse({ type: ListWalletResponseDto })
  async getWallets(@Req() req: RequestWithUser) {
    const { user } = req;
    return this.walletService.listUserAvailableWallets(user.id);
  }

  @Get(':walletUid')
  @ApiOperation({ summary: '获取钱包详情' })
  @ApiResponse({ type: WalletDetailResponseDto })
  async getWalletDetail(@Param('walletUid') walletUid: string) {
    return this.walletService.getWalletDetail(walletUid);
  }

  @Post(':walletUid/members/:memberUid')
  @ApiOperation({ summary: '添加钱包成员' })
  @ApiResponse({ type: BaseResponse })
  async addMember(
    @Param('walletUid') walletUid: string,
    @Param('memberUid') memberUid: string,
    @Body() body: AddMemberDto,
    @Req() req: RequestWithUser,
  ) {
    const { alias, creditLimit } = body;

    return this.walletService.addWalletMember(
      walletUid,
      memberUid,
      req.user.id,
      alias,
      creditLimit,
    );
  }

  @Delete(':walletUid/members/:memberUid')
  @ApiOperation({ summary: '移除钱包成员' })
  @ApiResponse({ type: BaseResponse })
  async removeMember(
    @Param('walletUid') walletUid: string,
    @Param('memberUid') memberUid: string,
    @Req() req: RequestWithUser,
  ) {
    return this.walletService.removeWalletMember(
      walletUid,
      memberUid,
      req.user.id,
    );
  }

  @Put(':walletUid/members/:memberUid')
  @ApiOperation({ summary: '更新钱包成员' })
  @ApiResponse({ type: BaseResponse })
  async updateMember(
    @Param('walletUid') walletUid: string,
    @Param('memberUid') memberUid: string,
    @Body() body: UpdateMemberDto,
    @Req() req: RequestWithUser,
  ) {
    const { alias, creditLimit } = body;

    return this.walletService.updateWalletMember(
      walletUid,
      memberUid,
      req.user.id,
      alias,
      creditLimit,
      false,
    );
  }

  @Patch(':walletUid/members/:memberUid/reset-credit-used')
  @ApiOperation({ summary: '重置钱包成员已使用额度' })
  @ApiResponse({ type: BaseResponse })
  async resetCreditUsed(
    @Param('walletUid') walletUid: string,
    @Param('memberUid') memberUid: string,
    @Req() req: RequestWithUser,
  ) {
    return this.walletService.updateWalletMember(
      walletUid,
      memberUid,
      req.user.id,
      undefined,
      undefined,
      true,
    );
  }

  @Get(':walletUid/api-calls')
  @ApiOperation({ summary: '获取钱包的API调用记录' })
  async getApiCallHistory(
    @Param('walletUid') walletUid: string,
    @Req() req: RequestWithUser,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const wallet = await this.walletService.getWalletDetail(walletUid);
    if (!wallet) {
      throw new BusinessException('Wallet not found');
    }

    // TODO: 检查用户是否有权限查看该钱包
    await this.walletService.getAuthorizedWallet(
      { uid: walletUid },
      req.user.id,
    );

    return this.billingService.getWalletApiCallHistory(wallet.id, {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 20,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get(':walletUid/billing-stats')
  @ApiOperation({ summary: '获取钱包的计费统计' })
  async getBillingStats(
    @Param('walletUid') walletUid: string,
    @Req() req: RequestWithUser,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const wallet = await this.walletService.getWalletDetail(walletUid);
    if (!wallet) {
      throw new BusinessException('Wallet not found');
    }

    // TODO: 检查用户是否有权限查看该钱包
    await this.walletService.getAuthorizedWallet(
      { uid: walletUid },
      req.user.id,
    );

    return this.billingService.getWalletBillingStats(
      wallet.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}
