import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../../user/user.module';
import { JwtTokenService } from '../jwt.service';
import { MicrosoftAuthController } from './microsoft-auth.controller';
import { MicrosoftAuthService } from './microsoft-auth.service';

@Module({
  imports: [HttpModule, ConfigModule, UserModule],
  controllers: [MicrosoftAuthController],
  providers: [MicrosoftAuthService, JwtTokenService],
  exports: [MicrosoftAuthService],
})
export class MicrosoftAuthModule {}
