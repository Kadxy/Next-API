// src/identity/identity.module.ts
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AdminAuthGuard } from './admin-auth.guard';
import { AuthService } from './auth.service';
import { JwtTokenService } from './jwt.service';
import { GitHubAuthModule } from './github/github-auth.module';
import { GoogleAuthModule } from './google/google-auth.module';
import { PasskeyModule } from './passkey/passkey.module';
import { CoreModule } from 'src/core/core.module';
import { FeishuAuthModule } from './feishu/feishu-auth.module';
@Module({
  imports: [
    CoreModule,
    UserModule,
    HttpModule,
    ConfigModule,
    GitHubAuthModule,
    GoogleAuthModule,
    PasskeyModule,
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
    FeishuAuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, AdminAuthGuard, JwtTokenService],
  exports: [AuthGuard, AdminAuthGuard, JwtModule, JwtTokenService],
})
export class AuthModule {}
