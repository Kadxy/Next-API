import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { UserService } from './user.service';
import { FeishuWebhookModule } from '../../core/feishu-webhook/feishu-webhook.module';
import { RedisModule } from '../../core/cache/redis.module';

@Module({
  imports: [PrismaModule, FeishuWebhookModule, RedisModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
