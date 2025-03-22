import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { DEFAULT_CACHE_TTL } from './chche.constant';

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
      store: await redisStore({ url: redisUrl, ttl: DEFAULT_CACHE_TTL }),
    };
  }
}
