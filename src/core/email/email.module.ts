import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FeishuWebhookModule } from '../feishu-webhook/feishu-webhook.module';
import { TencentEmailService } from './tencent/tencent-email.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), FeishuWebhookModule],
  providers: [TencentEmailService],
  exports: [TencentEmailService],
})
export class EmailModule {}
