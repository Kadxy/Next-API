import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard, RequestWithUser } from 'src/identity/auth/auth.guard';
import {
  AddMemberDto,
  ListWalletResponseDto,
  UpdateMemberDto,
  UpdateWalletDisplayNameDto,
  WalletDetailResponseDto,
} from './dto/wallet.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/interceptors/transform.interceptor';

@Controller('wallets')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

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
  async getWalletDetail(
    @Req() req: RequestWithUser,
    @Param('walletUid') walletUid: string,
  ) {
    return this.walletService.getWalletDetail(walletUid, req.user.id);
  }

  @Put(':walletUid/displayName')
  @ApiOperation({ summary: '更新钱包名称' })
  @ApiResponse({ type: BaseResponse })
  async updateWalletDisplayName(
    @Req() req: RequestWithUser,
    @Body() body: UpdateWalletDisplayNameDto,
    @Param('walletUid') walletUid: string,
  ) {
    return this.walletService.updateWalletDisplayName(
      walletUid,
      body.displayName,
      req.user.id,
    );
  }

  @Post(':walletUid/members/add')
  @ApiOperation({ summary: '添加钱包成员' })
  @ApiResponse({ type: BaseResponse })
  async addMember(
    @Req() req: RequestWithUser,
    @Body() body: AddMemberDto,
    @Param('walletUid') walletUid: string,
  ) {
    const { memberUid, alias, creditLimit } = body;

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
    @Req() req: RequestWithUser,
    @Param('walletUid') walletUid: string,
    @Param('memberUid') memberUid: string,
  ) {
    return this.walletService.removeWalletMember(
      walletUid,
      memberUid,
      req.user.id,
    );
  }

  @Post(':walletUid/members/leave')
  @ApiOperation({ summary: '离开钱包' })
  @ApiResponse({ type: BaseResponse })
  async leaveWallet(
    @Req() req: RequestWithUser,
    @Param('walletUid') walletUid: string,
  ) {
    return this.walletService.leaveWallet(walletUid, req.user.id);
  }

  @Put(':walletUid/members/:memberUid')
  @ApiOperation({ summary: '更新钱包成员' })
  @ApiResponse({ type: BaseResponse })
  async updateMember(
    @Body() body: UpdateMemberDto,
    @Req() req: RequestWithUser,
    @Param('walletUid') walletUid: string,
    @Param('memberUid') memberUid: string,
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

  @Post(':walletUid/members/:memberUid/resetCreditUsage')
  @ApiOperation({ summary: '重置钱包成员已使用额度' })
  @ApiResponse({ type: BaseResponse })
  async resetCreditUsage(
    @Req() req: RequestWithUser,
    @Param('walletUid') walletUid: string,
    @Param('memberUid') memberUid: string,
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
}
