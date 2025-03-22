import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FeishuWebhookService } from './feishu-webhook.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [FeishuWebhookService],
  exports: [FeishuWebhookService],
})
export class FeishuWebhookModule {}
