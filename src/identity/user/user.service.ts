import { Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { CACHE_KEYS, getCacheKey } from '../../core/cache/chche.constant';
import { Cache } from 'cache-manager';
import { FeishuWebhookService } from '../../core/feishu-webhook/feishu-webhook.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly displayNamePrefix = 'User';
  private readonly displayNameRandomLength = 4;
  private readonly registerBonus = new Decimal(1);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
    private readonly feishuWebhookService: FeishuWebhookService,
  ) {}

  // 创建用户
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    this.logger.log(`Creating user with data: ${JSON.stringify(data)}`);
    this.feishuWebhookService
      .sendText(`New user: ${JSON.stringify(data)}`)
      .catch();
    return await this.prisma.user.create({
      data: {
        // 生成默认昵称，如果下面提供了会覆盖
        displayName: this.generateDisplayName(),

        // 使用提供的用户数据
        ...data,

        // 对于余额，始终使用默认值
        wallet: {
          create: {
            balance: this.registerBonus,
          },
        },
      },
      include: { wallet: { select: { balance: true } } },
    });
  }

  // 从缓存获取用户
  async getCachedUser(uid: User['uid']): Promise<User | null> {
    // 从缓存获取
    const cacheKey = getCacheKey(CACHE_KEYS.USER_INFO_UID, uid);
    const cachedUser = await this.cacheService.get<User>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    // 从数据库获取
    const user = await this.prisma.user.findUnique({
      where: { uid },
      include: { wallet: { select: { balance: true } } },
    });

    // 更新缓存
    if (user) {
      await this.cacheService.set(
        cacheKey,
        user,
        CACHE_KEYS.USER_INFO_UID.EXPIRE,
      );
    }

    return user;
  }

  // 从数据库获取用户 - 通过邮箱
  async getUserByEmail(email: User['email']): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { wallet: { select: { balance: true } } },
    });

    // 更新缓存
    if (user) {
      await this.cacheService.set(
        getCacheKey(CACHE_KEYS.USER_INFO_UID, user.uid),
        user,
        CACHE_KEYS.USER_INFO_UID.EXPIRE,
      );
    }

    return user;
  }

  // 从数据库获取用户 - 通过GitHub ID
  async getUserByGithubId(githubId: User['githubId']): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { githubId },
      include: { wallet: { select: { balance: true } } },
    });

    // 更新缓存
    if (user) {
      await this.cacheService.set(
        getCacheKey(CACHE_KEYS.USER_INFO_UID, user.uid),
        user,
        CACHE_KEYS.USER_INFO_UID.EXPIRE,
      );
    }

    return user;
  }

  // 生成用户昵称，格式为：User_{random_string}
  private generateDisplayName(): string {
    return [
      this.displayNamePrefix,
      Math.random()
        .toString(36)
        .substring(2, 2 + this.displayNameRandomLength),
    ].join('_');
  }
}
