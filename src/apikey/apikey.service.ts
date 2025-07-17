import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CryptoService } from '../core/crypto/crypto.service';
import { BloomFilterService } from '../core/bloom-filter/bloom-filter.service';
import { ApiKey, User, Wallet } from '@prisma-main-client/client';
import { CACHE_KEYS, getCacheKey } from 'src/core/cache/chche.constant';
import {
  BusinessException,
  UnauthorizedException,
} from 'src/common/exceptions';
import {
  API_KEY_QUERY_OMIT,
  APIKEY_INCLUDE_WALLET_SELECT,
} from 'prisma/main/query.constant';
import { WalletService } from '../wallet/wallet.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FeishuWebhookService } from '../core/feishu-webhook/feishu-webhook.service';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class ApikeyService implements OnModuleInit {
  public static readonly BLOOM_FILTER_NAME = 'api_keys';
  private static readonly API_KEY_PREFIX = 'sk';
  private readonly logger = new Logger(ApikeyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly bloomFilterService: BloomFilterService,
    private readonly walletService: WalletService,
    private readonly feishuWebhookService: FeishuWebhookService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * 模块初始化时从数据库加载所有有效API密钥到布隆过滤器
   */
  async onModuleInit() {
    await this.rebuildBloomFilter();
  }

  // 每十分钟重建布隆过滤器
  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    await this.rebuildBloomFilter();
  }

  // 每 30 分钟检查, 确保 apikey 绑定的 wallet 全部合法
  @Cron(CronExpression.EVERY_30_MINUTES)
  async cronScanWalletKey() {
    const startTime = Date.now();

    this.logger.log('Scanning wallet keys');

    const wallets = await this.prisma.main.wallet.findMany({
      select: {
        id: true, // wallet id
        ownerId: true, // wallet owner userId
        members: {
          where: { isActive: true },
          include: { user: { select: { id: true } } },
        }, // active wallet member UserIds
      },
    });

    for (const wallet of wallets) {
      this.logger.debug(
        `wallet ${wallet.id}, owner ${wallet.ownerId}, members ${wallet.members.map((m) => m.user.id)}`,
      );

      // 1. 找到所有无效的API Key
      const invalidApiKeys = await this.prisma.main.apiKey.findMany({
        where: {
          walletId: wallet.id,
          isActive: true,
          creatorId: {
            notIn: [wallet.ownerId, ...wallet.members.map((m) => m.user.id)],
          },
        },
        select: { hashKey: true },
      });

      if (invalidApiKeys.length > 0) {
        this.logger.warn(
          `Found ${invalidApiKeys.length} invalid API key(s) in wallet ${wallet.id}` +
            JSON.stringify(invalidApiKeys.map((k) => k.hashKey)),
        );

        // 2.1 通知
        await this.feishuWebhookService.sendText(
          `⚠️ Found ${invalidApiKeys.length} invalid API key(s) in wallet ${wallet.id}, correcting...`,
        );

        // 2.2 删除
        await this.prisma.main.apiKey.updateMany({
          where: { hashKey: { in: invalidApiKeys.map((k) => k.hashKey) } },
          data: { isActive: false },
        });

        // 2.3 更新缓存
        invalidApiKeys.forEach((key) => {
          const cacheKey = getCacheKey(CACHE_KEYS.API_KEY, key.hashKey);
          this.cacheManager.del(cacheKey).catch((err) => {
            console.error('Failed to delete API key cache', err);
          });
        });
      } else {
        this.logger.debug(`No invalid API keys found in wallet ${wallet.id}`);
      }
    }

    this.logger.log(`Scan completed in ${Date.now() - startTime}ms`);
  }

  // 创建 API Key
  async createApiKey(
    displayName: string,
    walletUid: Wallet['uid'],
    creatorId: User['id'],
  ) {
    // 1. 验证钱包访问权限
    const wallet = await this.walletService.getAccessibleWallet(
      { uid: walletUid },
      creatorId,
    );

    const { id: walletId } = wallet;

    // 2. 生成密钥
    const randomStr = this.cryptoService.generateRandomString();

    // 3. 生成预览(前4位和后4位)
    const preview = [randomStr.slice(0, 4), randomStr.slice(-4)].join('');

    // 4. 拼接
    const rawKey = [ApikeyService.API_KEY_PREFIX, randomStr].join('-');

    // 5. 计算哈希密钥
    const hashKey = this.cryptoService.hashString(rawKey);

    // 6. 创建记录
    const apiKey = await this.prisma.main.apiKey.create({
      data: { hashKey, creatorId, displayName, preview, walletId },
      omit: API_KEY_QUERY_OMIT,
    });

    // 7. 将新密钥添加到布隆过滤器
    this.bloomFilterService
      .getFilter(ApikeyService.BLOOM_FILTER_NAME)
      .add(hashKey);

    return { rawKey, apiKey };
  }

  // 更新 API Key 名称
  async updateApiKeyDisplayName(
    hashKey: ApiKey['hashKey'],
    newDisplayName: ApiKey['displayName'],
    userId: User['id'],
  ) {
    // 先获取 API Key 信息
    const apiKey = await this.prisma.main.apiKey.findUnique({
      where: { hashKey, isActive: true },
      select: { walletId: true, creatorId: true },
    });

    if (!apiKey) {
      throw new BusinessException('API Key not found');
    }

    // 验证权限：必须是创建者或钱包 owner
    await this.walletService.getAccessibleWallet(
      { id: apiKey.walletId },
      userId,
    );

    return this.prisma.main.apiKey.update({
      where: { hashKey },
      data: { displayName: newDisplayName },
      omit: API_KEY_QUERY_OMIT,
    });
  }

  // 删除 API Key
  async deleteApiKey(hashKey: ApiKey['hashKey'], creatorId: User['id']) {
    // 先获取 API Key 信息
    const apiKey = await this.prisma.main.apiKey.findUnique({
      where: { hashKey, creatorId, isDeleted: false },
    });

    if (!apiKey) {
      throw new BusinessException('API Key not found');
    }

    // 软删除
    await this.prisma.main.apiKey.update({
      where: { hashKey },
      data: { isActive: false, isDeleted: true },
    });

    // 清除缓存
    const cacheKey = getCacheKey(CACHE_KEYS.API_KEY, hashKey);
    await this.cacheManager.del(cacheKey);
  }

  // 列出用户创建的 API Key
  async listApiKeys(creatorId: User['id']) {
    return this.prisma.main.apiKey.findMany({
      where: { creatorId, isDeleted: false }, // 不包含已删除的, 但包含失效的
      include: { wallet: { select: APIKEY_INCLUDE_WALLET_SELECT } },
      omit: API_KEY_QUERY_OMIT,
    });
  }

  // 验证 API Key 并返回记录 [有效、未删除、钱包额度充足、成员信用额度充足]
  async verifyApiKey(apiKey: string): Promise<ApiKey> {
    let record: ApiKey;

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    // 0. 分割
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

    // 4.1 优先查询缓存
    const cacheKey = getCacheKey(CACHE_KEYS.API_KEY, hashKey);
    record = await this.cacheManager.get<ApiKey>(cacheKey);

    // 4.2 缓存未命中则查询数据库
    if (!record) {
      record = await this.prisma.main.apiKey.findUnique({
        where: { hashKey, isActive: true, isDeleted: false },
      });

      // 4.2.1 数据库无记录
      if (!record) {
        throw new UnauthorizedException('Invalid API key');
      }

      // 4.2.2 更新缓存
      this.cacheManager
        .set(cacheKey, record, CACHE_KEYS.API_KEY.EXPIRE)
        .catch((err) => {
          console.error('Failed to cache API key', err);
        });
    }

    const { walletId, creatorId } = record;

    // 5 检查钱包和成员余额
    await this.walletService.checkBalance(walletId, creatorId);

    return record;
  }

  private async rebuildBloomFilter(retryTimes = 0) {
    this.logger.log('Rebuilding bloom filter');
    const tempFilterName = ApikeyService.BLOOM_FILTER_NAME + '_rebuild_temp';

    try {
      const apiKeys = await this.prisma.main.apiKey.findMany({
        where: { isActive: true, isDeleted: false },
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
