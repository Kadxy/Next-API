import { Inject, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PrismaService } from '../core/prisma/prisma.service';
import { CryptoService } from '../core/crypto/crypto.service';
import { BloomFilterService } from '../core/bloom-filter/bloom-filter.service';
import { Cache } from '@nestjs/cache-manager';
import { ApiKey, User, Wallet } from '@prisma-client';
import { CACHE_KEYS, getCacheKey } from 'src/core/cache/chche.constant';
import {
  BusinessException,
  UnauthorizedException,
} from 'src/common/exceptions';
import {
  API_KEY_QUERY_OMIT,
  APIKEY_INCLUDE_WALLET_SELECT,
} from 'prisma/query.constant';
import { WalletService } from '../wallet/wallet.service';
import { Cron, CronExpression } from '@nestjs/schedule';

export interface ApiKeyRecord extends ApiKey {
  wallet: Wallet;
}

@Injectable()
export class ApikeyService implements OnModuleInit {
  private readonly logger = new Logger(ApikeyService.name);
  private static readonly API_KEY_PREFIX = 'sk';
  private static readonly BLOOM_FILTER_NAME = 'api_keys';
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly bloomFilterService: BloomFilterService,
    private readonly walletService: WalletService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * 模块初始化时从数据库加载所有有效API密钥到布隆过滤器
   */
  async onModuleInit() {
    await this.rebuildBloomFilter();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    await this.rebuildBloomFilter();
  }

  // 创建 API Key
  async createApiKey(
    displayName: string,
    walletUid: Wallet['uid'],
    creatorUserId: User['id'],
  ) {
    // 1. 验证钱包访问权限
    const wallet = await this.walletService.getAuthorizedWallet(
      { uid: walletUid },
      creatorUserId,
    );

    // 2. 生成随机字符串
    const randomStr = this.cryptoService.generateRandomString();

    // 3. 生成预览(前4位和后4位)
    const preview = [randomStr.slice(0, 4), randomStr.slice(-4)].join('');

    // 4. 生成原始密钥
    const rawKey = [ApikeyService.API_KEY_PREFIX, randomStr].join('-');

    // 5. 计算哈希密钥
    const hashKey = this.cryptoService.hashString(rawKey);

    // 6. 创建记录
    const apiKey = await this.prisma.apiKey.create({
      data: {
        walletId: wallet.id,
        creatorId: creatorUserId,
        hashKey,
        preview,
        displayName,
      },
      omit: API_KEY_QUERY_OMIT,
    });

    // 7. 将新密钥添加到布隆过滤器
    const filter = this.bloomFilterService.getFilter(
      ApikeyService.BLOOM_FILTER_NAME,
    );
    if (filter) {
      filter.add(hashKey);
    }

    return { rawKey, apiKey };
  }

  // 更新 API Key 名称
  async updateApiKeyDisplayName(
    hashKey: ApiKey['hashKey'],
    newDisplayName: ApiKey['displayName'],
    userId: User['id'],
  ) {
    // 先获取 API Key 信息
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { hashKey, isActive: true },
      select: { walletId: true, creatorId: true },
    });

    if (!apiKey) {
      throw new BusinessException('API Key not found');
    }

    // 验证权限：必须是创建者或钱包 owner
    await this.walletService.getAuthorizedWallet(
      { id: apiKey.walletId },
      userId,
    );

    return this.prisma.apiKey.update({
      where: { hashKey },
      data: { displayName: newDisplayName },
      omit: API_KEY_QUERY_OMIT,
    });
  }

  // 撤销 API Key
  async inactivateApiKey(hashKey: ApiKey['hashKey'], userId: User['id']) {
    // 先获取 API Key 信息
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { hashKey, isActive: true },
      select: { walletId: true, creatorId: true },
    });

    if (!apiKey) {
      throw new BusinessException('API Key not found');
    }

    // 验证钱包权限
    await this.walletService.getAuthorizedWallet(
      { id: apiKey.walletId },
      userId,
    );

    // 更新状态
    await this.prisma.apiKey.update({
      where: { hashKey },
      data: { isActive: false },
    });

    // 清除缓存
    const cacheKey = getCacheKey(CACHE_KEYS.API_KEY, hashKey);
    await this.cacheManager.del(cacheKey);
  }

  // 批量撤销用户创建的所有 API Keys（当用户被删除或离开钱包时）
  async inactivateWalletMemberApiKeys(
    walletId: Wallet['id'],
    creatorId: User['id'],
  ) {
    // 查询
    const apiKeys = await this.prisma.apiKey.findMany({
      where: { walletId, creatorId, isActive: true },
      select: { hashKey: true },
    });

    // 清除缓存
    apiKeys.forEach((key) => {
      this.cacheManager.del(getCacheKey(CACHE_KEYS.API_KEY, key.hashKey));
    });

    // 更新数据库
    await this.prisma.apiKey.updateMany({
      where: { walletId, creatorId, isActive: true },
      data: { isActive: false },
    });
  }

  // 列出用户创建的 API Key
  async listApiKeys(userId: User['id']) {
    return this.prisma.apiKey.findMany({
      where: { creatorId: userId, isActive: true },
      include: { wallet: { select: APIKEY_INCLUDE_WALLET_SELECT } },
      omit: API_KEY_QUERY_OMIT,
    });
  }

  // 验证 API Key 并返回记录
  async verifyApiKey(apiKey: string): Promise<ApiKeyRecord> {
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
      this.logger.debug('Bloom filter check failed');
      throw new UnauthorizedException('Invalid API key');
    }

    // 4. 优先查询缓存
    const cacheKey = getCacheKey(CACHE_KEYS.API_KEY, hashKey);
    const cachedApiKey = await this.cacheManager.get<
      ApiKey & { wallet: Wallet }
    >(cacheKey);
    if (cachedApiKey) {
      return cachedApiKey;
    }

    // 5. 查询数据库（包含钱包信息）
    const record = await this.prisma.apiKey.findUnique({
      where: { hashKey, isActive: true },
      include: { wallet: true },
    });

    if (!record) {
      throw new UnauthorizedException('Invalid API key');
    }

    // 6. 缓存结果(不阻塞)
    this.cacheManager
      .set(cacheKey, record, CACHE_KEYS.API_KEY.EXPIRE)
      .catch((err) => {
        console.error('Failed to cache API key', err);
      });

    return record;
  }

  private async rebuildBloomFilter(retryTimes = 0) {
    this.logger.log('Rebuilding bloom filter');
    const tempFilterName = ApikeyService.BLOOM_FILTER_NAME + '_rebuild_temp';

    try {
      const apiKeys = await this.prisma.apiKey.findMany({
        where: { isActive: true },
        select: { hashKey: true },
      });

      // 1. 创建新的临时filter
      const newFilter = this.bloomFilterService.createFilter(
        tempFilterName,
        Math.max(10000, apiKeys.length * 5),
        3,
      );
      newFilter.addAll(apiKeys.map((key) => key.hashKey));

      // 2. 原子替换主filter
      this.bloomFilterService.replaceFilter(
        ApikeyService.BLOOM_FILTER_NAME,
        newFilter,
      );
    } catch (error) {
      this.logger.error('Failed to rebuild bloom filter', error);
      // 尝试重新构建
      if (retryTimes < 2) {
        await this.rebuildBloomFilter(retryTimes + 1);
      } else {
        this.logger.error('Failed to rebuild bloom filter after 2 retries');
      }
    } finally {
      // 3. 删除临时filter (无论成功与否)
      this.bloomFilterService.deleteFilter(tempFilterName);
    }
  }

  // TODO: Update API Key last used time - RabbitMQ Task
}
