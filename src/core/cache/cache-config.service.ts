import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { DEFAULT_CACHE_TTL } from './chche.constant';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}

  /**
   * 创建缓存配置
   * @returns 缓存配置
   */
  async createCacheOptions(): Promise<CacheModuleOptions> {
    const redisUrl = this.configService.getOrThrow<string>('REDIS_URL');

    return {
      store: {
        create: () =>
          new Keyv({
            store: new KeyvRedis(redisUrl),
            namespace: 'cache',
            ttl: DEFAULT_CACHE_TTL,
          }),
      },
      isGlobal: true,
    };
  }
}
