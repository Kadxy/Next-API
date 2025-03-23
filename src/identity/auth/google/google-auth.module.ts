import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../../user/user.module';
import { JwtTokenService } from '../jwt.service';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';

@Module({
  imports: [HttpModule, ConfigModule, UserModule],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService, JwtTokenService],
  exports: [GoogleAuthService],
})
export class GoogleAuthModule {}
