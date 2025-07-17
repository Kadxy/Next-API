import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenAIController } from './openai.controller';
import { OpenAIService } from './openai.service';
import { TransactionModule } from '../../transaction/transaction.module';
import { ApikeyModule } from '../../apikey/apikey.module';
import { CoreModule } from '../../core/core.module';
import { TiktokenService } from 'src/transaction/tiktoken/tiktoken.service';

@Module({
  imports: [HttpModule, CoreModule, ApikeyModule, TransactionModule],
  controllers: [OpenAIController],
  providers: [OpenAIService, TiktokenService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
