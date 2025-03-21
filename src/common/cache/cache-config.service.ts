import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    const redisUrl = this.configService.get<string>('REDIS_URL');

    return {
      store: redisStore,
      url: redisUrl,
      ttl: 60 * 60 * 24, // 24 hours default TTL
      max: 10000, // maximum number of items in cache
    } as RedisClientOptions;
  }
}
