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
  QueryOrderResponseDto,
  RechargeResponseV1Dto,
} from './dto/epay.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard, RequestWithUser } from 'src/identity/auth/auth.guard';

@Controller('epay')
export class EpayController {
  constructor(private readonly epayService: EpayService) {}

  @Get('price')
  @ApiResponse({ type: EpayPriceResponseDto })
  @ApiOperation({
    summary: '传入充值美元额度, 获取充值价格、人民币价格、汇率',
  })
  async getPrice(@Query() query: EpayPriceRequestDto) {
    const { quota } = query;
    return this.epayService.getPrice(quota);
  }

  @UseGuards(AuthGuard)
  @Post('recharge/wallet/:walletUid')
  @ApiResponse({ type: RechargeResponseV1Dto })
  @ApiOperation({
    summary: '传入充值美元额度、支付方式, 创建充值订单',
  })
  async handleRecharge(
    @Req() req: RequestWithUser,
    @Body() body: EpayRechargeRequestDto,
    @Param('walletUid') walletUid: string,
    @Ip() clientIp: string,
  ) {
    const { id: userId } = req.user;
    const { quota, paymentMethod } = body;
    return this.epayService.handleRecharge(
      userId,
      walletUid,
      quota,
      paymentMethod,
      clientIp,
    );
  }

  @UseGuards(AuthGuard)
  @Get('query/:trade_no')
  @ApiResponse({ type: QueryOrderResponseDto })
  @ApiOperation({
    summary: '传入trade_no, 查询订单状态',
  })
  async handleQueryOrder(@Param('trade_no') trade_no: string) {
    return this.epayService.handleQueryOrder(trade_no);
  }

  @Get('notify')
  @ApiOperation({
    summary: '处理易支付平台回调, 返回成功状态',
  })
  async handleNotify(
    @Query() query: EpayNotifyResult,
    @Res() reply: FastifyReply,
  ) {
    const success = await this.epayService.handleNotify(query);
    reply.send({ success });
  }
}
