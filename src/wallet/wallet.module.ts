import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CoreModule } from 'src/core/core.module';
import { WalletController } from './wallet.controller';
import { AuthModule } from 'src/identity/auth/auth.module';
import { BillingModule } from 'src/billing/billing.module';
import { UserService } from '../identity/user/user.service';
import { UserModule } from '../identity/user/user.module';

@Module({
  imports: [CoreModule, AuthModule, BillingModule,UserModule],
  providers: [WalletService],
  exports: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
