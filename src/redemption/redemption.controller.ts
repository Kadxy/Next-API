import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard, RequestWithUser } from 'src/identity/auth/auth.guard';
import { AdminAuthGuard } from 'src/identity/auth/admin-auth.guard';
import { RedemptionService } from './redemption.service';
import {
  CreateRedemptionCodeDto,
  CreateRedemptionCodeResponseDto,
  RedeemCodeDto,
  RedeemCodeResponseData,
  GetAllRedemptionCodesResponseDto,
  RedeemCodeResponseDto,
} from './dto/redemption.dto';

@Controller('redemption')
export class RedemptionController {
  constructor(private readonly redemptionService: RedemptionService) {}

  @Get()
  @ApiOperation({ summary: '获取所有兑换码' })
  @ApiResponse({ type: GetAllRedemptionCodesResponseDto })
  @UseGuards(AdminAuthGuard) // require admin
  async getAllRedemptionCodes() {
    return await this.redemptionService.getAllRedemptionCodes();
  }

  @Post()
  @ApiOperation({ summary: '创建兑换码' })
  @ApiBody({ type: CreateRedemptionCodeDto })
  @ApiResponse({ type: CreateRedemptionCodeResponseDto })
  @UseGuards(AdminAuthGuard) // require admin
  async createCode(@Body() body: CreateRedemptionCodeDto) {
    const { amount, remark } = body;

    return await this.redemptionService.createRedemptionCode(amount, remark);
  }

  @Post('redeem')
  @ApiOperation({ summary: '兑换' })
  @ApiBody({ type: RedeemCodeDto })
  @ApiResponse({ type: RedeemCodeResponseDto })
  @UseGuards(AuthGuard)
  async redeem(
    @Req() req: RequestWithUser,
    @Body() body: RedeemCodeDto,
  ): Promise<RedeemCodeResponseData> {
    const { user } = req;
    const { code, walletUid } = body;

    const redeemedQuota = await this.redemptionService.doRedeem(
      code,
      walletUid,
      user.id,
    );

    return { quota: redeemedQuota.toString() };
  }
}
