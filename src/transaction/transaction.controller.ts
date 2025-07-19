import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard, RequestWithUser } from 'src/identity/auth/auth.guard';
import {
  SelfTransactionQueryDto,
  WalletTransactionQueryDto,
  TransactionListResponseDto,
  TransactionDetailResponseDto,
} from './dto/transaction-query.dto';

@ApiTags('Transaction')
@Controller('transaction')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('self')
  @ApiOperation({ summary: '查询当前用户的交易记录' })
  @ApiResponse({ type: TransactionListResponseDto })
  async getSelfTransactions(
    @Req() req: RequestWithUser,
    @Query() query: SelfTransactionQueryDto,
  ) {
    return this.transactionService.getSelfTransactions(req.user.id, query);
  }

  @Get('wallet/:walletUid')
  @ApiOperation({ summary: '查询钱包的交易记录（仅钱包所有者）' })
  @ApiResponse({ type: TransactionListResponseDto })
  async getWalletTransactions(
    @Req() req: RequestWithUser,
    @Param('walletUid') walletUid: string,
    @Query() query: WalletTransactionQueryDto,
  ) {
    return this.transactionService.getWalletTransactions(
      req.user.id,
      walletUid,
      query,
    );
  }

  @Get('detail/:businessId')
  @ApiOperation({ summary: '查询交易详情' })
  @ApiResponse({ type: TransactionDetailResponseDto })
  async getTransactionDetail(
    @Req() req: RequestWithUser,
    @Param('businessId') businessId: string,
  ) {
    return this.transactionService.getTransactionDetail(
      req.user.id,
      businessId,
    );
  }
}
