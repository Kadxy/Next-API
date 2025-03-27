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
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly feishuWebhookService: FeishuWebhookService,
  ) {}

  async updateLastLoginAt(id: User['id']) {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  // 创建用户
  async createUser(data: Prisma.UserCreateInput) {
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

  // 从缓存获取用户 - 通过 UID
  async getCachedUser(uid: User['uid']) {
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

    return this.updateUserCacheAndReturn(user);
  }

  // 从数据库获取用户 - 通过自增 ID
  async getUserById(id: User['id']) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { wallet: { select: { balance: true } } },
    });

    return this.updateUserCacheAndReturn(user);
  }

  // 从数据库获取用户 - 通过邮箱
  async getUserByEmail(email: User['email']) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { wallet: { select: { balance: true } } },
    });

    return this.updateUserCacheAndReturn(user);
  }

  // 从数据库获取用户 - 通过 GitHub ID
  async getUserByGitHubId(gitHubId: User['gitHubId']) {
    const user = await this.prisma.user.findUnique({
      where: { gitHubId },
      include: { wallet: { select: { balance: true } } },
    });

    return this.updateUserCacheAndReturn(user);
  }

  // 从数据库获取用户 - 通过 Google ID
  async getUserByGoogleId(googleId: User['googleId']) {
    const user = await this.prisma.user.findUnique({
      where: { googleId },
      include: { wallet: { select: { balance: true } } },
    });

    return this.updateUserCacheAndReturn(user);
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

  // 更新缓存并返回用户
  private async updateUserCacheAndReturn(user: User | null) {
    if (user) {
      try {
        await this.cacheService.set(
          getCacheKey(CACHE_KEYS.USER_INFO_UID, user.uid),
          user,
          CACHE_KEYS.USER_INFO_UID.EXPIRE,
        );
      } catch (error) {
        this.logger.error(`Failed to update user cache: ${error}`);
      }
    }
    return user;
  }
}
