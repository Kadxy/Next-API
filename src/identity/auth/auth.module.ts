// src/identity/identity.module.ts
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../../core/email/email.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { JwtTokenService } from './jwt.service';
import { FeishuWebhookModule } from '../../core/feishu-webhook/feishu-webhook.module';
import { GitHubAuthModule } from './github/github-auth.module';
import { GoogleAuthModule } from './google/google-auth.module';

@Module({
  imports: [
    EmailModule,
    UserModule,
    HttpModule,
    ConfigModule,
    FeishuWebhookModule,
    GitHubAuthModule,
    GoogleAuthModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.getOrThrow<number>('JWT_EXPIRES_IN')}`,
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, JwtTokenService],
  exports: [AuthGuard, JwtModule, JwtTokenService],
})
export class AuthModule {}
