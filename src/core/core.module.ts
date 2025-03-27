import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CryptoModule } from './crypto/crypto.module';
import { BloomFilterModule } from './bloom-filter/bloom-filter.module';
import { FeishuWebhookModule } from './feishu-webhook/feishu-webhook.module';
import { EmailModule } from './email/email.module';
@Module({
  imports: [
    BloomFilterModule,
    CryptoModule,
    EmailModule,
    FeishuWebhookModule,
    PrismaModule,
  ],
  exports: [
    BloomFilterModule,
    CryptoModule,
    EmailModule,
    FeishuWebhookModule,
    PrismaModule,
  ],
})
export class CoreModule {}
