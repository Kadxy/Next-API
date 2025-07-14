import { Module } from '@nestjs/common';
import { FeishuAuthService } from './feishu-auth.service';
import { FeishuAuthController } from './feishu-auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtTokenService } from '../jwt.service';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [ConfigModule,UserModule],
  controllers: [FeishuAuthController],
  providers: [FeishuAuthService, JwtTokenService],
  exports: [FeishuAuthService],
})
export class FeishuAuthModule {}
