import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CoreModule } from 'src/core/core.module';
import { WalletController } from './wallet.controller';
import { AuthModule } from 'src/identity/auth/auth.module';
import { BillingModule } from 'src/billing/billing.module';

@Module({
  imports: [CoreModule, AuthModule, BillingModule],
  providers: [WalletService],
  exports: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
