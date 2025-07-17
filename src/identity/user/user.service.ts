import { Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma, User } from '@prisma-main-client/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CACHE_KEYS, getCacheKey } from '../../core/cache/chche.constant';
import { Cache } from 'cache-manager';
import { FeishuWebhookService } from '../../core/feishu-webhook/feishu-webhook.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  USER_QUERY_INCLUDE,
  USER_QUERY_OMIT,
} from 'prisma/main/query.constant';
import { BusinessException } from 'src/common/exceptions';
import { generateDisplayName } from '../../utils';

// 使用 Prisma 生成的类型定义受限用户查询结果
export type LimitedUser = Prisma.UserGetPayload<{
  include: typeof USER_QUERY_INCLUDE;
  omit: typeof USER_QUERY_OMIT;
}>;

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly feishuWebhookService: FeishuWebhookService,
  ) {}

  // 更新用户最后登录时间
  async updateLastLoginAt(uid: User['uid'], lastLoginAt: Date) {
    const result = await this.prisma.main.user.update({
      where: { uid },
      data: { lastLoginAt },
    });

    await this.updateUserCache(result);
  }

  // 统一创建用户
  async createUser(data: Prisma.UserCreateInput): Promise<LimitedUser> {
    // 0. 打印日志, 发送通知
    this.logger.log(`Creating user with data: ${JSON.stringify(data)}`);
    this.feishuWebhookService
      .sendText(`New user: ${JSON.stringify(data)}`)
      .catch();

    // 1. 创建用户
    const user = await this.prisma.main.user.create({
      data: {
        displayName: generateDisplayName('User', 6),
        ...data, // 使用提供的用户数据
      },
    });

    if (!user?.id) {
      throw new BusinessException('Failed to register');
    }

    // 2. 更新缓存
    await this.updateUserCache(user);

    // 3. 创建默认钱包
    await this.prisma.main.wallet.create({
      data: {
        owner: { connect: { id: user.id } },
        members: { create: { user: { connect: { id: user.id } } } },
        displayName: generateDisplayName('Wallet', 6),
      },
    });

    // 4. 返回受限用户对象
    return this.constructLimitedUser(user);
  }

  // 从缓存获取用户 - 通过 UID 【这个方法会返回全部字段信息】
  async getCachedUser(uid: User['uid']): Promise<User | null> {
    let user: User | null;

    // 从缓存获取
    const cacheKey = getCacheKey(CACHE_KEYS.USER_INFO_UID, uid);
    user = await this.cacheService.get<User | null>(cacheKey);

    // 如果缓存中没有，则从数据库获取
    if (!user) {
      user = await this.prisma.main.user.findUnique({ where: { uid } });

      if (user) {
        await this.updateUserCache(user);
      }
    }

    // 返回完整用户信息（可能为空）
    return user;
  }

  // 从缓存获取用户 - 通过 UID
  async getCachedLimitedUser(uid: User['uid']): Promise<LimitedUser | null> {
    const user = await this.getCachedUser(uid);
    return user ? this.constructLimitedUser(user) : null;
  }

  // 从数据库获取用户 - 通过自增 ID
  async getUserById(id: User['id']) {
    return this.getDbUser({ id });
  }

  // 从数据库获取用户 - 通过邮箱
  async getUserByEmail(email: User['email']) {
    return this.getDbUser({ email });
  }

  // 从数据库获取用户 - 通过 GitHub ID
  async getUserByGitHubId(gitHubId: User['gitHubId']) {
    return this.getDbUser({ gitHubId });
  }

  // 从数据库获取用户 - 通过 Google ID
  async getUserByGoogleId(googleId: User['googleId']) {
    return this.getDbUser({ googleId });
  }

  // 从数据库获取用户 - 通过 Feishu ID
  async getUserByFeishuId(feishuId: User['feishuId']) {
    return this.getDbUser({ feishuId });
  }

  // 从数据库获取用户 - 通过 Microsoft ID
  async getUserByMicrosoftId(microsoftId: User['microsoftId']) {
    return this.getDbUser({ microsoftId });
  }

  // 绑定第三方账号
  async bindThirdPartyAccount(
    userId: User['id'],
    thirdPartyType:
      | 'gitHubId'
      | 'googleId'
      | 'feishuId'
      | 'microsoftId'
      | 'email',
    value: string,
  ): Promise<LimitedUser> {
    let existUser = null;
    let updateSql: Prisma.UserUpdateInput;

    switch (thirdPartyType) {
      case 'gitHubId':
        existUser = await this.getUserByGitHubId(value);
        updateSql = { gitHubId: value };
        break;
      case 'googleId':
        existUser = await this.getUserByGoogleId(value);
        updateSql = { googleId: value };
        break;
      case 'feishuId':
        existUser = await this.getUserByFeishuId(value);
        updateSql = { feishuId: value };
        break;
      case 'microsoftId':
        existUser = await this.getUserByMicrosoftId(value);
        updateSql = { microsoftId: value };
        break;
      case 'email':
        existUser = await this.getUserByEmail(value);
        updateSql = { email: value };
        break;
      default:
        throw new BusinessException('Invalid third-party type');
    }

    if (existUser) {
      throw new BusinessException('Account already bound');
    }

    const user = await this.prisma.main.user.update({
      where: { id: userId },
      data: updateSql,
    });

    await this.updateUserCache(user);

    return this.constructLimitedUser(user);
  }

  // 更新用户显示名称
  async updateDisplayName(uid: User['uid'], displayName: string) {
    const user = await this.prisma.main.user.update({
      where: { uid },
      data: { displayName },
    });

    await this.updateUserCache(user);

    return this.constructLimitedUser(user);
  }

  // 通用查询方法 - 从数据库查询完整信息，更新缓存，返回受限字段
  private async getDbUser(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<LimitedUser | null> {
    // 查询完整信息
    const user = await this.prisma.main.user.findUnique({ where });

    if (!user) {
      return null;
    }

    // 异步更新缓存
    this.updateUserCache(user).catch((error) => {
      this.logger.error(`Failed to cache user: ${error}`);
    });

    // 返回受限用户对象
    return this.constructLimitedUser(user);
  }

  // 构造受限用户对象（模拟 include 和 omit 的效果）
  private constructLimitedUser(user: User): LimitedUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...userWithoutOmitted } = user;

    return {
      ...userWithoutOmitted,
    } as unknown as LimitedUser;
  }

  // 更新用户缓存（存储完整信息）
  private async updateUserCache(user: User): Promise<void> {
    try {
      await this.cacheService.set<User>(
        getCacheKey(CACHE_KEYS.USER_INFO_UID, user.uid),
        user,
        CACHE_KEYS.USER_INFO_UID.EXPIRE,
      );
    } catch (error) {
      this.logger.error(`Failed to update user cache: ${error}`);
    }
  }
}
