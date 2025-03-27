import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PrismaService } from '../core/prisma/prisma.service';
import { CryptoService } from '../core/crypto/crypto.service';
import { BloomFilterService } from '../core/bloom-filter/bloom-filter.service';
import { Cache } from '@nestjs/cache-manager';
import { ApiKey, Prisma, User } from '@prisma/client';
import { CACHE_KEYS, getCacheKey } from 'src/core/cache/chche.constant';
import { UnauthorizedException } from 'src/common/exceptions';

@Injectable()
export class ApikeyService implements OnModuleInit {
  static readonly API_KEY_PREFIX = 'sk';
  private static readonly BLOOM_FILTER_NAME = 'api_keys';
  private readonly listSelect: Prisma.ApiKeySelect = {
    hashKey: true,
    preview: true,
    displayName: true,
    lastUsedAt: true,
    createdAt: true,
    updatedAt: true,
  };
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly bloomFilterService: BloomFilterService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * 模块初始化时从数据库加载所有有效API密钥到布隆过滤器
   */
  async onModuleInit() {
    try {
      // 获取所有未删除的API密钥的hashKey
      const apiKeys = await this.prisma.apiKey.findMany({
        where: { isDeleted: false },
        select: { hashKey: true },
      });

      // 创建布隆过滤器并添加所有密钥
      const filter = this.bloomFilterService.getOrCreateFilter(
        ApikeyService.BLOOM_FILTER_NAME,
        Math.max(10000, apiKeys.length * 5), // 确保足够大小
        3,
      );

      // 添加到布隆过滤器
      filter.addAll(apiKeys.map((key) => key.hashKey));
      console.log(`布隆过滤器已初始化，共加载 ${apiKeys.length} 个API密钥`);
    } catch (error) {
      console.error('布隆过滤器初始化失败', error);
    }
  }

  // 创建 APIKEY，返回原始密钥（仅在创建时返回）
  async createApiKey(userId: User['id']) {
    // 1. 生成随机字符串
    const randomStr = this.cryptoService.generateRandomString();

    // 2. 生成预览(前4位和后4位)
    const preview = randomStr.slice(0, 4) + randomStr.slice(-4);

    // 3. 生成原始密钥
    const rawKey = `${ApikeyService.API_KEY_PREFIX}-${randomStr}`;

    // 4. 计算哈希密钥
    const hashKey = this.cryptoService.hashString(rawKey);

    // 5. 创建记录
    await this.prisma.apiKey.create({ data: { userId, hashKey, preview } });

    // 6. 将新密钥添加到布隆过滤器
    const filter = this.bloomFilterService.getFilter(
      ApikeyService.BLOOM_FILTER_NAME,
    );
    if (filter) {
      filter.add(hashKey);
    }

    return { rawKey };
  }

  // 更新 APIKEY 名称，返回更新后的 APIKEY 记录
  async updateApiKeyDisplayName(
    userId: User['id'],
    hashKey: ApiKey['hashKey'],
    displayName: ApiKey['displayName'],
  ) {
    await this.prisma.apiKey.update({
      where: { userId, hashKey, isDeleted: false },
      data: { displayName },
      select: this.listSelect,
    });
  }

  // 删除 APIKEY，无返回值
  async deleteApiKey(userId: User['id'], hashKey: ApiKey['hashKey']) {
    await this.prisma.apiKey.update({
      where: { userId, hashKey, isDeleted: false },
      data: { isDeleted: true },
    });
  }

  // 获取用户 APIKEY 列表
  async getUserApiKeys(userId: User['id']) {
    return await this.prisma.apiKey.findMany({
      where: { userId, isDeleted: false },
      select: this.listSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  // 验证 APIKEY，返回 APIKEY 记录
  async verifyApiKey(apiKey: string): Promise<ApiKey> {
    // 检查传入参数格式
    if (!apiKey || typeof apiKey !== 'string') {
      throw new UnauthorizedException('API key is required');
    }

    const parts = apiKey.split('-');
    if (parts.length !== 2) {
      throw new UnauthorizedException('Invalid API key format');
    }

    const [prefix, rawKey] = parts;

    // 1. 验证格式
    if (prefix !== ApikeyService.API_KEY_PREFIX || rawKey.length !== 48) {
      throw new UnauthorizedException('Invalid API key format');
    }

    // 2. 计算哈希
    const hashKey = this.cryptoService.hashString(apiKey);

    // 3. 布隆过滤器快速检查
    const filter = this.bloomFilterService.getFilter(
      ApikeyService.BLOOM_FILTER_NAME,
    );
    if (filter && !filter.mightContain(hashKey)) {
      throw new UnauthorizedException('Invalid API key');
    }

    // 4. 优先查询缓存
    const cacheKey = getCacheKey(CACHE_KEYS.API_KEY, hashKey);
    const cachedApiKey = await this.cacheManager.get<ApiKey>(cacheKey);
    if (cachedApiKey) {
      return cachedApiKey;
    }

    // 5. 查询数据库
    const record = await this.prisma.apiKey.findUnique({
      where: { hashKey, isDeleted: false },
    });

    if (!record) {
      throw new UnauthorizedException('Invalid API key');
    }

    // 6. 缓存结果(不阻塞)
    this.cacheManager
      .set(cacheKey, record, CACHE_KEYS.API_KEY.EXPIRE)
      .catch((err) => {
        console.error('缓存API密钥失败', err);
      });

    return record;
  }
}
