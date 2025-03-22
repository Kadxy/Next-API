import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config/config.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './identity/auth/auth.module';
import { UserModule } from './identity/user/user.module';
import { EmailModule } from './core/email/email.module';
import { FeishuWebhookModule } from './core/feishu-webhook/feishu-webhook.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import { DEFAULT_CACHE_TTL } from './core/cache/chche.constant';

@Module({
  imports: [
    // https://docs.nestjs.com/techniques/caching#interacting-with-the-cache-store
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          stores: [
            new KeyvRedis(configService.getOrThrow<string>('REDIS_URL')),
          ],
          ttl: DEFAULT_CACHE_TTL,
        };
      },
      isGlobal: true,
      inject: [ConfigService],
    }),
    ConfigModule,
    PrismaModule,
    AuthModule,
    UserModule,
    FeishuWebhookModule,
    EmailModule,
  ],
})
export class AppModule {}
