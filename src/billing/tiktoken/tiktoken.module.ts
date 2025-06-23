import { Module } from '@nestjs/common';
import { TiktokenService } from './tiktoken.service';

@Module({
  providers: [TiktokenService],
  exports: [TiktokenService],
})
export class TiktokenModule {}
