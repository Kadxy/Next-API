import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CoreModule } from '../core/core.module';
import { TiktokenModule } from './tiktoken/tiktoken.module';

@Module({
  imports: [CoreModule, TiktokenModule],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
