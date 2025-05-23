import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard, RequestWithUser } from 'src/identity/auth/auth.guard';
import { AdminAuthGuard } from 'src/identity/auth/admin-auth.guard';
import { RedemptionService } from './redemption.service';
import {
  CreateRedemptionCodeDto,
  CreateRedemptionCodeResponseDto,
  RedeemCodeDto,
  RedeemCodeResponseDto,
} from './dto/redemption.dto';

@Controller('redemption')
export class RedemptionController {
  constructor(private readonly redemptionService: RedemptionService) {}

  @Post('code')
  @ApiOperation({ summary: '创建兑换码' })
  @ApiBody({ type: CreateRedemptionCodeDto })
  @ApiResponse({ type: CreateRedemptionCodeResponseDto })
  @UseGuards(AdminAuthGuard) // require admin
  async createCode(@Body() body: CreateRedemptionCodeDto) {
    const { amount, remark, expiredDays } = body;

    const expiredDuration = expiredDays
      ? expiredDays * 24 * 60 * 60 * 1000
      : undefined;

    return await this.redemptionService.createRedemptionCode(
      amount,
      expiredDuration,
      remark,
    );
  }

  @Post('redeem')
  @ApiOperation({ summary: '兑换' })
  @ApiBody({ type: RedeemCodeDto })
  @ApiResponse({ type: RedeemCodeResponseDto })
  @UseGuards(AuthGuard)
  async redeem(@Req() req: RequestWithUser, @Body() body: RedeemCodeDto) {
    const { user } = req;
    const { code } = body;

    const balance = await this.redemptionService.doRedeem(code, user.id);

    return { balance: balance.toString() };
  }
}
