import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EpayController } from './epay.controller';
import { EpayService } from './epay.service';

@Module({
  imports: [HttpModule],
  providers: [EpayService],
  controllers: [EpayController],
})
export class EpayModule {}
