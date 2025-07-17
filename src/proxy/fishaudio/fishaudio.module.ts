import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FishAudioController } from './fishaudio.controller';
import { FishAudioService } from './fishaudio.service';
import { TransactionModule } from '../../transaction/transaction.module';
import { ApikeyModule } from '../../apikey/apikey.module';
import { CoreModule } from '../../core/core.module';

@Module({
  imports: [HttpModule, CoreModule, ApikeyModule, TransactionModule],
  controllers: [FishAudioController],
  providers: [FishAudioService],
  exports: [FishAudioService],
})
export class FishAudioModule {}
