import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_KEYS, getCacheKey } from 'src/core/cache/chche.constant';
import { BusinessException, ForbiddenException } from 'src/common/exceptions';
import { Prisma, User, Wallet, WalletMember } from '@prisma-main-client/client';
import {
  OWNER_WALLET_QUERY_OMIT,
  OWNER_WALLET_QUERY_WALLET_MEMBER_SELECT,
  SIMPLE_WALLET_QUERY_SELECT,
} from 'prisma/main/query.constant';
import { UserService } from '../identity/user/user.service';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../core/prisma/prisma.service';

export interface WalletWithMembers extends Wallet {
  members: WalletMember[];
}

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly userService: UserService,
  ) {}

  /**
   * @param where - wallet id or uid
   * @param userId - user id
   * @param requireOwner - whether to check owner permission, default is false
   * @throws {BusinessException} if wallet not found or permission denied
   * @returns wallet info if accessible, otherwise throw error
   */
  async getAccessibleWallet(
    where: Prisma.WalletWhereUniqueInput,
    userId: User['id'],
    requireOwner = false,
  ): Promise<WalletWithMembers | null> {
    const wallet = await this.getWallet(where);

    if (!wallet) {
      throw new BusinessException('wallet not found');
    }

    const { id, ownerId, members } = wallet;

    const isOwner = ownerId === userId;
    const isMember = members.some((m) => m.userId === userId && m.isActive);

    const accessible = isOwner || (!requireOwner && isMember);

    if (!accessible) {
      throw new BusinessException('permission denied');
    }

    this.logger.debug(`Wallet (id:${id}) accessible by user (id:${userId})`);

    return wallet;
  }

  async listUserAccessibleWallets(userId: User['id']) {
    const joinedWallet = await this.prisma.main.walletMember.findMany({
      where: { userId, isActive: true },
      select: {
        creditUsed: true,
        creditLimit: true,
        wallet: { select: SIMPLE_WALLET_QUERY_SELECT },
      },
      orderBy: [
        { createdAt: 'asc' }, // 创建时间早的在前
      ],
    });

    // NOTE: if you update schema, you need to update this function
    return joinedWallet.map((member) => ({
      uid: member.wallet.uid,
      balance: member.wallet.balance.toString(),
      displayName: member.wallet.displayName,
      owner: member.wallet.owner,
      isOwner: member.wallet.ownerId === userId, // 是否是钱包所有者
      creditUsed: member.creditUsed.toString(),
      creditLimit: member.creditLimit.toString(),
    }));
  }

  async updateDisplayName(
    walletUid: Wallet['uid'],
    displayName: string,
    userId: User['id'],
  ) {
    // 1. 验证用户是否是钱包所有者
    const wallet = await this.getAccessibleWallet(
      { uid: walletUid },
      userId,
      true,
    );

    // 2. 更新钱包名称
    await this.prisma.main.wallet.update({
      where: { id: wallet.id },
      data: { displayName },
    });

    // 3. 清理缓存
    await this.cleanCache(wallet);
  }

  async addWalletMember(
    walletUid: Wallet['uid'],
    memberUid: User['uid'],
    operatorId: User['id'],
    alias: string,
    creditLimit: number,
  ) {
    const { wallet, memberUser, existRecord } =
      await this.validateWalletMemberOperation(
        walletUid,
        memberUid,
        operatorId,
        true, // requireOwner
      );

    if (existRecord) {
      throw new BusinessException('Member already in wallet');
    }

    // 创建成员记录
    await this.prisma.main.walletMember.create({
      data: {
        alias,
        creditLimit,
        wallet: { connect: { id: wallet.id } },
        user: { connect: { id: memberUser.id } },
      },
    });

    // 清理缓存
    await this.cleanCache(wallet);
  }

  async removeWalletMember(
    walletUid: Wallet['uid'],
    memberUid: User['uid'],
    operatorId: User['id'],
  ) {
    const { wallet, memberUser, existRecord } =
      await this.validateWalletMemberOperation(
        walletUid,
        memberUid,
        operatorId,
        true, // requireOwner
      );

    if (!existRecord) {
      throw new BusinessException('Member not found');
    }

    if (!existRecord.isActive) {
      throw new BusinessException('Member already removed');
    }

    if (existRecord.userId === wallet.ownerId) {
      throw new BusinessException('Cannot remove wallet owner');
    }

    await Promise.all([
      // 更新 walletMember, isActive = false
      this.prisma.main.walletMember.update({
        where: { id: existRecord.id },
        data: { isActive: false },
      }),

      // 禁用 apiKey
      this.inactiveApiKeys(wallet.id, memberUser.id),
    ]);

    // 清理缓存
    await this.cleanCache(wallet);
  }

  async updateWalletMember(
    walletUid: Wallet['uid'],
    memberUid: User['uid'],
    operatorId: User['id'],
    alias?: string,
    creditLimit?: number,
    resetCreditUsed = false,
  ) {
    const { wallet, existRecord } = await this.validateWalletMemberOperation(
      walletUid,
      memberUid,
      operatorId,
      true, // requireOwner
    );

    if (!existRecord) {
      throw new BusinessException('Member not found');
    }

    // 更新记录
    await this.prisma.main.walletMember.update({
      where: { id: existRecord.id },
      data: {
        ...(alias && { alias }),
        ...(creditLimit !== undefined && { creditLimit: { set: creditLimit } }),
        ...(resetCreditUsed && { creditUsed: { set: 0 } }),
      },
    });

    // 清理缓存
    await this.cleanCache(wallet);
  }

  async reactivateWalletMember(
    walletUid: Wallet['uid'],
    memberUid: User['uid'],
    operatorId: User['id'],
  ) {
    const { wallet, existRecord } = await this.validateWalletMemberOperation(
      walletUid,
      memberUid,
      operatorId,
      true, // requireOwner
      true, // useCachedUser
    );

    if (!existRecord) {
      throw new BusinessException('Member not found');
    }

    if (existRecord.isActive) {
      throw new BusinessException('Member already active');
    }

    // 更新记录
    await this.prisma.main.walletMember.update({
      where: { id: existRecord.id },
      data: {
        isActive: true,
        creditUsed: { set: 0 },
        creditLimit: { set: 0 },
      },
    });

    // 清理缓存
    await this.cleanCache(wallet);
  }

  async resetWalletMemberCreditUsage(
    walletUid: Wallet['uid'],
    memberUid: User['uid'],
    operatorId: User['id'],
  ) {
    return this.updateWalletMember(
      walletUid,
      memberUid,
      operatorId,
      undefined,
      undefined,
      true,
    );
  }

  async leaveWallet(walletUid: Wallet['uid'], userId: User['id']) {
    // 1. 验证用户是否在钱包中
    const wallet = await this.getAccessibleWallet({ uid: walletUid }, userId);

    // 2. 检查用户是否 owner
    if (wallet.ownerId === userId) {
      throw new BusinessException('Owner cannot leave wallet');
    }

    await Promise.all([
      // 2.1 更新 walletMember
      await this.prisma.main.walletMember.update({
        where: {
          walletId_userId: { walletId: wallet.id, userId },
        },
        data: { isActive: false },
      }),

      // 2.2 更新 apiKey
      await this.inactiveApiKeys(wallet.id, userId),
    ]);

    // 3. 清理缓存
    await this.cleanCache(wallet);
  }

  async getWalletDetail(walletUid: Wallet['uid'], userId: User['id']) {
    return this.prisma.main.wallet.findUnique({
      where: { uid: walletUid, ownerId: userId },
      include: {
        members: {
          select: OWNER_WALLET_QUERY_WALLET_MEMBER_SELECT,
          orderBy: [
            { isActive: 'desc' }, // 有效的在前
            { createdAt: 'asc' }, // 创建时间早的在前
          ],
        },
      },
      omit: OWNER_WALLET_QUERY_OMIT,
    });
  }

  async checkBalance(walletId: Wallet['id'], userId: User['id']) {
    const wallet = await this.getWallet({ id: walletId });
    const member = wallet.members.find(
      (m) => m.userId === userId && m.isActive,
    );

    if (!wallet || !member) {
      throw new BusinessException('Failed to check balance');
    }

    if (new Decimal(wallet.balance).lte(0)) {
      throw new ForbiddenException('Insufficient wallet balance');
    }

    if (
      !new Decimal(member.creditLimit).eq(0) && // 不是无限额度
      new Decimal(member.creditLimit).lte(member.creditUsed) // 已使用额度超过限制
    ) {
      throw new ForbiddenException('Insufficient member credit');
    }
  }

  /**
   * 充值钱包余额
   * @param tx - 事务客户端
   * @param where - 钱包ID或UID
   * @param amount - 充值金额
   * @returns 更新后的钱包
   */
  async onRecharge(
    tx: Prisma.TransactionClient,
    where: Prisma.WalletWhereUniqueInput,
    amount: number,
  ): Promise<Wallet> {
    const wallet = await tx.wallet.update({
      where,
      data: { balance: { increment: amount } },
    });

    await this.cleanCache(wallet);

    return wallet;
  }

  /**
   * 验证钱包成员操作的通用方法
   * @param walletUid - 钱包UID
   * @param memberUid - 成员UID
   * @param operatorId - 操作者ID
   * @param requireOwner - 是否需要所有者权限
   * @param useCachedUser - 是否使用缓存用户查询
   * @returns 验证后的钱包、成员用户和现有记录
   */
  private async validateWalletMemberOperation(
    walletUid: Wallet['uid'],
    memberUid: User['uid'],
    operatorId: User['id'],
    requireOwner = false,
    useCachedUser = false,
  ) {
    // 1. 验证操作者是否有权限
    const wallet = await this.getAccessibleWallet(
      { uid: walletUid },
      operatorId,
      requireOwner,
    );

    // 2. 查询目标用户
    const memberUser = useCachedUser
      ? await this.userService.getCachedUser(memberUid)
      : await this.prisma.main.user.findUnique({
          where: { uid: memberUid },
        });

    if (!memberUser) {
      throw new BusinessException('User not found');
    }

    // 3. 查找现有成员记录
    const existRecord = wallet.members.find((m) => m.userId === memberUser.id);

    return { wallet, memberUser, existRecord };
  }

  /**
   * Get cached wallet info, if not cached, get from database and cache it
   * @param where - wallet id or uid
   * @returns wallet info if cached or found in database, null only if not found in database
   * @throws BusinessException if invalid wallet ID or UID
   */
  private async getWallet(
    where: Prisma.WalletWhereUniqueInput,
  ): Promise<WalletWithMembers | null> {
    let cacheKey: string;

    if (where.id) {
      cacheKey = getCacheKey(CACHE_KEYS.WALLET_INFO_ID, where.id);
    } else if (where.uid) {
      cacheKey = getCacheKey(CACHE_KEYS.WALLET_INFO_UID, where.uid);
    } else {
      throw new BusinessException('Invalid wallet ID or UID');
    }

    const cachedWallet = await this.cacheManager.get(cacheKey);

    if (cachedWallet) {
      return cachedWallet as WalletWithMembers;
    }

    return this.getDbWallet(where);
  }

  private async getDbWallet(where: Prisma.WalletWhereUniqueInput) {
    const wallet = await this.prisma.main.wallet.findUnique({
      where,
      include: { members: true },
    });

    // Cache wallet info
    if (wallet) {
      this.cache(wallet).catch();
    }

    return wallet as WalletWithMembers | null;
  }

  private async cache(wallet: Wallet) {
    const cacheKeyId = getCacheKey(CACHE_KEYS.WALLET_INFO_ID, wallet.id);
    const cacheKeyUid = getCacheKey(CACHE_KEYS.WALLET_INFO_UID, wallet.uid);

    await this.cacheManager.set(cacheKeyId, wallet);
    await this.cacheManager.set(cacheKeyUid, wallet);
  }

  private async cleanCache(wallet: Wallet) {
    const cacheKeyId = getCacheKey(CACHE_KEYS.WALLET_INFO_ID, wallet.id);
    const cacheKeyUid = getCacheKey(CACHE_KEYS.WALLET_INFO_UID, wallet.uid);

    await this.cacheManager.del(cacheKeyId);
    await this.cacheManager.del(cacheKeyUid);
  }

  // Inactivate all api keys belong to a wallet member
  private async inactiveApiKeys(walletId: Wallet['id'], creatorId: User['id']) {
    const apiKeys = await this.prisma.main.apiKey.findMany({
      where: { walletId, creatorId, isActive: true },
    });

    if (apiKeys.length > 0) {
      for (const key of apiKeys) {
        await Promise.all([
          this.prisma.main.apiKey.update({
            where: { hashKey: key.hashKey },
            data: { isActive: false },
          }),

          this.cacheManager.del(getCacheKey(CACHE_KEYS.API_KEY, key.hashKey)),
        ]);
      }
    }
  }
}
