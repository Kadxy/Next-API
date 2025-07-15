import { Module } from '@nestjs/common';
import { FeishuAppService } from './feishu-app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/identity/user/user.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [ConfigModule, CoreModule, UserModule],
  providers: [FeishuAppService],
  exports: [FeishuAppService],
})
export class FeishuAppModule {}
