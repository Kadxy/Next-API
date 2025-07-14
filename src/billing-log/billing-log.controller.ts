import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { BillingLogService } from './billing-log.service';
import { AuthGuard, RequestWithUser } from '../identity/auth/auth.guard';
import {
  BillingLogDetailResponseDto,
  BillingLogListResponseDto,
  QueryBillingLogsDto,
} from './dto/billing-log.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Billing Logs')
@Controller('billing-logs')
@UseGuards(AuthGuard)
export class BillingLogController {
  constructor(private readonly billingLogService: BillingLogService) {}

  @Get('self')
  @ApiOperation({ summary: '查询自己的计费日志' })
  @ApiResponse({ type: BillingLogListResponseDto })
  async querySelfBillingLogs(
    @Req() req: RequestWithUser,
    @Query() query: QueryBillingLogsDto,
  ) {
    return this.billingLogService.querySelfBillingLogs(req.user.id, query);
  }

  @Get('wallet/:walletUid')
  @ApiOperation({
    summary: '查询钱包的计费日志（成员只能看自己的，owner能看全部）',
  })
  @ApiResponse({ type: BillingLogListResponseDto })
  async queryWalletBillingLogs(
    @Req() req: RequestWithUser,
    @Param('walletUid') walletUid: string,
    @Query() query: QueryBillingLogsDto,
  ) {
    return this.billingLogService.queryWalletBillingLogs(
      req.user.id,
      walletUid,
      query,
    );
  }

  @Get('detail/:requestId')
  @ApiOperation({ summary: '获取计费日志详情' })
  @ApiResponse({ type: BillingLogDetailResponseDto })
  async getBillingLogDetail(
    @Req() req: RequestWithUser,
    @Param('requestId') requestId: string,
  ) {
    return this.billingLogService.getBillingLogDetail(requestId, req.user.id);
  }
}
