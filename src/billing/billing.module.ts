import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { CoreModule } from '../core/core.module';
import { WalletModule } from '../wallet/wallet.module';
import { AuthModule } from '../identity/auth/auth.module';
import { TiktokenModule } from './tiktoken/tiktoken.module';

@Module({
  imports: [CoreModule, WalletModule, AuthModule, TiktokenModule],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
