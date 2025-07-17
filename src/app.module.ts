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
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedemptionModule } from './redemption/redemption.module';
import { BillingModule } from './billing/billing.module';
import { ProxyModule } from './proxy/proxy.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WalletModule } from './wallet/wallet.module';
import { FeishuAppService } from './feishu-app/feishu-app.service';
import { FeishuAppModule } from './feishu-app/feishu-app.module';

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
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule,
    AuthModule,
    UserModule,
    ApikeyModule,
    CoreModule,
    RedemptionModule,
    BillingModule,
    ProxyModule,
    WalletModule,
    FeishuAppModule,
  ],
  providers: [FeishuAppService],
})
export class AppModule {}
