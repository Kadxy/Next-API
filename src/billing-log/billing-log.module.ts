import { Module } from '@nestjs/common';
import { BillingLogService } from './billing-log.service';
import { BillingLogController } from './billing-log.controller';
import { CoreModule } from '../core/core.module';
import { WalletModule } from '../wallet/wallet.module';
import { UserModule } from '../identity/user/user.module';
import { AuthModule } from '../identity/auth/auth.module';

@Module({
  imports: [CoreModule, WalletModule, UserModule, AuthModule],
  controllers: [BillingLogController],
  providers: [BillingLogService],
  exports: [BillingLogService],
})
export class BillingLogModule {}
