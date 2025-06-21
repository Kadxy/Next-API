import { Module } from '@nestjs/common';
import { TiktokenService } from './tiktoken.service';

@Module({
  providers: [TiktokenService]
})
export class TiktokenModule {}
