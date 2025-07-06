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
  async getWalletDetail(@Param('walletUid') walletUid: string) {
    return this.walletService.getWalletDetail(walletUid);
  }

  @Put(':walletUid/displayName')
  @ApiOperation({ summary: '更新钱包名称' })
  @ApiResponse({ type: BaseResponse })
  async updateWalletDisplayName(
    @Param('walletUid') walletUid: string,
    @Body() body: { displayName: string },
    @Req() req: RequestWithUser,
  ) {
    return this.walletService.updateWalletDisplayName(
      walletUid,
      body.displayName,
      req.user.id,
    );
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

  @Post(':walletUid/members/leave')
  @ApiOperation({ summary: '离开钱包' })
  @ApiResponse({ type: BaseResponse })
  async leaveWallet(
    @Param('walletUid') walletUid: string,
    @Req() req: RequestWithUser,
  ) {
    return this.walletService.leaveWallet(walletUid, req.user.id);
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
}
