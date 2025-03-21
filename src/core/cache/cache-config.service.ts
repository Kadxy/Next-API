import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    const redisUrl = this.configService.getOrThrow<string>('REDIS_URL');

    return {
      url: redisUrl,

      // Use the redisStore as the store
      store: redisStore,

      // 24 hours default TTL
      ttl: 60 * 60 * 24,

      // maximum number of items in cache
      max: 10000,
    } as RedisClientOptions;
  }
}
