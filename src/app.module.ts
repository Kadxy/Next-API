import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config/config.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { RedisModule } from './core/cache/redis.module';
import { AuthModule } from './identity/auth/auth.module';
import { UserModule } from './identity/user/user.module';
import { EmailModule } from './core/email/email.module';
import { FeishuWebhookModule } from './core/feishu-webhook/feishu-webhook.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    RedisModule,
    AuthModule,
    UserModule,
    FeishuWebhookModule,
    EmailModule,
  ],
})
export class AppModule {}
