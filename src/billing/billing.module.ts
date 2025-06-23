import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { TiktokenModule } from './tiktoken/tiktoken.module';
import { CoreModule } from 'src/core/core.module';
import { AuthModule } from 'src/identity/auth/auth.module';

@Module({
  imports: [CoreModule, TiktokenModule, AuthModule],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
