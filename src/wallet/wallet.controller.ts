import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard, RequestWithUser } from 'src/identity/auth/auth.guard';
import { ListWalletResponseDto } from './dto/wallet.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('wallet')
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
}
