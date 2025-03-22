import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../../user/user.module';
import { JwtTokenService } from '../jwt.service';
import { GitHubAuthController } from './github-auth.controller';
import { GitHubAuthService } from './github-auth.service';
@Module({
  imports: [HttpModule, ConfigModule, UserModule],
  controllers: [GitHubAuthController],
  providers: [GitHubAuthService, JwtTokenService],
  exports: [GitHubAuthService],
})
export class GitHubAuthModule {}
