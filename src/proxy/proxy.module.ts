import { Module } from '@nestjs/common';
import { TransactionModule } from '../transaction/transaction.module';
import { ApikeyModule } from '../apikey/apikey.module';
import { HttpModule } from '@nestjs/axios';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { CoreModule } from '../core/core.module';
import { TiktokenService } from 'src/transaction/tiktoken/tiktoken.service';
@Module({
  imports: [HttpModule, CoreModule, ApikeyModule, TransactionModule],
  controllers: [ProxyController],
  providers: [ProxyService, TiktokenService],
  exports: [ProxyService],
})
export class ProxyModule {}
