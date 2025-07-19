import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TiktokenModule } from '../core/tiktoken/tiktoken.module';
import { CoreModule } from 'src/core/core.module';
import { AuthModule } from 'src/identity/auth/auth.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [CoreModule, TiktokenModule, AuthModule,WalletModule],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
