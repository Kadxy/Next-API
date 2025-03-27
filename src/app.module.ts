import { Module } from '@nestjs/common';
import { AuthModule } from './identity/auth/auth.module';
import { UserModule } from './identity/user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import { DEFAULT_CACHE_TTL } from './core/cache/chche.constant';
import { ApikeyModule } from './apikey/apikey.module';
import { CoreModule } from './core/core.module';
import { ConfigModule } from './core/config/config.module';
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
    AuthModule,
    UserModule,
    ApikeyModule,
    CoreModule,
  ],
})
export class AppModule {}
