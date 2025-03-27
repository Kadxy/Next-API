import { Module } from '@nestjs/common';
import { ApikeyService } from './apikey.service';
import { ApikeyController } from './apikey.controller';
import { CoreModule } from 'src/core/core.module';
import { AuthModule } from 'src/identity/auth/auth.module';

@Module({
  imports: [CoreModule, AuthModule],
  controllers: [ApikeyController],
  providers: [ApikeyService],
  exports: [ApikeyService],
})
export class ApikeyModule {}
