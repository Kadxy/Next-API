import {
  Body,
  Controller,
  Get,
  Ip,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EpayService } from './epay.service';
import { EpayNotifyResult } from './interface/epay.interface';
import { FastifyReply } from 'fastify';
import {
  EpayPriceRequestDto,
  EpayPriceResponseDto,
  EpayRechargeRequestDto,
} from './dto/epay.dto';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard, RequestWithUser } from 'src/identity/auth/auth.guard';

@Controller('epay')
export class EpayController {
  constructor(private readonly epayService: EpayService) {}

  @Get('price')
  @ApiResponse({ type: EpayPriceResponseDto })
  async getPrice(@Query() query: EpayPriceRequestDto) {
    const { quota } = query;
    return this.epayService.getPrice(quota);
  }

  @UseGuards(AuthGuard)
  @Post('recharge/wallet/:walletUid')
  async handleRecharge(
    @Req() req: RequestWithUser,
    @Body() body: EpayRechargeRequestDto,
    @Param('walletUid') walletUid: string,
    @Ip() clientIp: string,
  ) {
    const { id: userId } = req.user;
    const { quota, payType } = body;
    return this.epayService.handleRecharge(
      userId,
      walletUid,
      quota,
      payType,
      clientIp,
    );
  }

  @UseGuards(AuthGuard)
  @Get('query/:businessId')
  async handleQueryOrder(@Param('businessId') businessId: string) {
    return this.epayService.handleQueryOrder(businessId);
  }

  @Get('notify')
  async handleNotify(
    @Query() query: EpayNotifyResult,
    @Res() reply: FastifyReply,
  ) {
    const success = await this.epayService.handleNotify(query);
    reply.send({ success });
  }
}
