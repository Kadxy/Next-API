import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_KEYS, getCacheKey } from 'src/core/cache/chche.constant';
import { BusinessException } from 'src/common/exceptions';
import { Prisma, User, Wallet, WalletMember } from '@prisma-client/client';
import {
  OWNER_WALLET_QUERY_OMIT,
  OWNER_WALLET_QUERY_WALLET_MEMBER_SELECT,
  SIMPLE_WALLET_QUERY_SELECT,
} from 'prisma/query.constant';
import { UserService } from '../identity/user/user.service';

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
  async getAuthorizedWallet(
    where: Prisma.WalletWhereUniqueInput,
    userId: User['id'],
    requireOwner = false,
  ): ReturnType<typeof this.getCachedWallet> | null {
    const wallet = await this.getCachedWallet(where);

    if (!wallet) {
      throw new BusinessException('Wallet not found');
    }

    const isOwner = wallet.ownerId === userId;
    const isMember = wallet.members.some(
      (member) => member.userId === userId && member.isActive,
    );

    // 所有者权限判断
    if (requireOwner && !isOwner) {
      throw new BusinessException('Permission denied: owner access required');
    }

    // 成员权限判断 (当不需要所有者权限时，是所有者或成员均可)
    if (!requireOwner && !isOwner && !isMember) {
      throw new BusinessException('Permission denied: no wallet access');
    }

    return wallet;
  }

  async listUserAccessibleWallets(userId: User['id']) {
    const joinedWallet = await this.prisma.walletMember.findMany({
      where: { userId, isActive: true },
      select: {
        isOwner: true,
        wallet: { select: SIMPLE_WALLET_QUERY_SELECT },
      },
      orderBy: [
        { isOwner: 'desc' }, // 是钱包所有者的在前
        { createdAt: 'asc' }, // 创建时间早的在前
      ],
    });

    return joinedWallet.map((wallet) => ({
      ...wallet.wallet,
      isOwner: wallet.isOwner,
    }));
  }

  async updateDisplayName(
    walletUid: Wallet['uid'],
    displayName: string,
    userId: User['id'],
  ) {
    // 1. 验证用户是否是钱包所有者
    const wallet = await this.getAuthorizedWallet(
      { uid: walletUid },
      userId,
      true,
    );

    // 2. 更新钱包名称
    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { displayName },
    });

    // 3. 清理缓存
    await this.cleanCache(wallet);
  }

  async addWalletMember(
    walletUid: Wallet['uid'],
    memberUid: User['uid'],
    inviterId: User['id'],
    alias: string,
    creditLimit: number,
  ) {
    // 1. 验证 inviter 是否有权限添加成员
    const authorizedWallet = await this.getAuthorizedWallet(
      { uid: walletUid },
      inviterId,
      true,
    );

    // 2. 根据的 memberUid 查询 user.id
    const memberUser = await this.prisma.user.findUnique({
      where: { uid: memberUid, isDeleted: false },
    });

    if (!memberUser) {
      throw new BusinessException('User not found');
    }

    // 3.1 检查 memberUser 是否已经加入钱包
    const existRecord = authorizedWallet.members.find(
      (m) => m.userId === memberUser.id,
    );

    if (existRecord) {
      throw new BusinessException('Member already in wallet');
    }

    // 3. 创建成员记录
    await this.prisma.walletMember.create({
      data: {
        alias,
        creditLimit,
        wallet: { connect: { id: authorizedWallet.id } },
        user: { connect: { id: memberUser.id } },
      },
    });

    // 4. 清理缓存
    await this.cleanCache(authorizedWallet);
  }

  async removeWalletMember(
    walletUid: Wallet['uid'],
    memberUid: User['uid'],
    inviterId: User['id'],
  ) {
    // 1. 验证 inviter 是否有权限删除成员
    const authorizedWallet = await this.getAuthorizedWallet(
      { uid: walletUid },
      inviterId,
      true,
    );

    // 2. 根据的 memberUid 查询 user.id
    const memberUser = await this.prisma.user.findUnique({
      where: { uid: memberUid, isDeleted: false },
    });

    if (!memberUser) {
      throw new BusinessException('User not found');
    }

    // 3.1 检查 memberUser 是否存在
    const existRecord = authorizedWallet.members.find(
      (m) => m.userId === memberUser.id,
    );

    if (!existRecord) {
      throw new BusinessException('Member not found');
    }

    // 3.2 检查 memberUser 是否已经失效
    if (!existRecord.isActive) {
      throw new BusinessException('Member already removed');
    }

    // 3.3 检查 memberUser 是否是 owner
    if (existRecord.isOwner) {
      throw new BusinessException('Cannot remove wallet owner');
    }

    await Promise.all([
      // 4.1 更新 walletMember, isActive = false
      this.prisma.walletMember.update({
        where: { id: existRecord.id },
        data: { isActive: false },
      }),

      // 4.2 禁用 apiKey
      this.inactiveApiKeys(authorizedWallet.id, memberUser.id),
    ]);

    // 5. 清理缓存
    await this.cleanCache(authorizedWallet);
  }

  async updateWalletMember(
    walletUid: Wallet['uid'],
    memberUid: User['uid'],
    inviterId: User['id'],
    alias?: string,
    creditLimit?: number,
    resetCreditUsed = false,
  ) {
    // 1. 验证 inviter 是否有权限更新成员
    const authorizedWallet = await this.getAuthorizedWallet(
      { uid: walletUid },
      inviterId,
      true,
    );

    // 2. 根据的 memberUid 查询 user.id
    const memberUser = await this.prisma.user.findUnique({
      where: { uid: memberUid, isDeleted: false },
    });

    if (!memberUser) {
      throw new BusinessException('User not found');
    }

    // 3.1 检查 memberUser 是否存在
    const existRecord = authorizedWallet.members.find(
      (m) => m.userId === memberUser.id,
    );

    if (!existRecord) {
      throw new BusinessException('Member not found');
    }

    // 4. 更新记录
    await this.prisma.walletMember.update({
      where: { id: existRecord.id },
      data: {
        ...(alias && { alias }),
        ...(creditLimit && { creditLimit }),
        ...(resetCreditUsed && { creditUsed: { set: 0 } }),
      },
    });

    // 5. 清理缓存
    await this.cleanCache(authorizedWallet);
  }

  async reactivateWalletMember(
    walletUid: Wallet['uid'],
    memberUid: User['uid'],
    inviterId: User['id'],
  ) {
    // 1. 验证 inviter 是否有权限更新成员
    const authorizedWallet = await this.getAuthorizedWallet(
      { uid: walletUid },
      inviterId,
      true,
    );

    // 2. 根据的 memberUid 查询 user.id
    const memberUser = await this.userService.getCachedUser(memberUid);

    if (!memberUser || memberUser.isDeleted) {
      throw new BusinessException('User not found');
    }

    // 3.1 检查 memberUser 是否存在
    const existRecord = authorizedWallet.members.find(
      (m) => m.userId === memberUser.id,
    );

    if (!existRecord) {
      throw new BusinessException('Member not found');
    }

    // 3.2 检查 memberUser 是否已经激活
    if (existRecord.isActive) {
      throw new BusinessException('Member already active');
    }

    // 4. 更新记录
    await this.prisma.walletMember.update({
      where: { id: existRecord.id },
      data: {
        isActive: true,
        creditUsed: { set: 0 },
        creditLimit: { set: 0 },
      },
    });

    // 5. 清理缓存
    await this.cleanCache(authorizedWallet);
  }

  async resetWalletMemberCreditUsage(
    walletUid: Wallet['uid'],
    memberUid: User['uid'],
    inviterId: User['id'],
  ) {
    return this.updateWalletMember(
      walletUid,
      memberUid,
      inviterId,
      undefined,
      undefined,
      true,
    );
  }


  async leaveWallet(walletUid: Wallet['uid'], userId: User['id']) {
    // 1. 验证用户是否在钱包中
    const wallet = await this.getAuthorizedWallet({ uid: walletUid }, userId);

    // 2. 检查用户是否 owner
    if (wallet.ownerId === userId) {
      throw new BusinessException('Owner cannot leave wallet');
    }

    await Promise.all([
      // 2.1 更新 walletMember
      await this.prisma.walletMember.update({
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
    return this.prisma.wallet.findUnique({
      where: { uid: walletUid, ownerId: userId },
      include: {
        members: {
          select: OWNER_WALLET_QUERY_WALLET_MEMBER_SELECT,
          orderBy: [
            { isOwner: 'desc' }, // 是钱包所有者的在前
            { isActive: 'desc' }, // 有效的在前
            { createdAt: 'asc' }, // 创建时间早的在前
          ],
        },
      },
      omit: OWNER_WALLET_QUERY_OMIT,
    });
  }

  /**
   * Get cached wallet info, if not cached, get from database and cache it
   * @param where - wallet id or uid
   * @returns wallet info if cached or found in database, null only if not found in database
   * @throws BusinessException if invalid wallet ID or UID
   */
  private async getCachedWallet(
    where: Prisma.WalletWhereUniqueInput,
  ): ReturnType<typeof this.getDbWallet> {
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
      return cachedWallet as Wallet & { members: WalletMember[] };
    }

    return this.getDbWallet(where);
  }

  private async getDbWallet(where: Prisma.WalletWhereUniqueInput) {
    const wallet = await this.prisma.wallet.findUnique({
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
    const apiKeys = await this.prisma.apiKey.findMany({
      where: { walletId, creatorId, isActive: true },
    });

    if (apiKeys.length > 0) {
      for (const key of apiKeys) {
        await Promise.all([
          this.prisma.apiKey.update({
            where: { hashKey: key.hashKey },
            data: { isActive: false },
          }),

          this.cacheManager.del(getCacheKey(CACHE_KEYS.API_KEY, key.hashKey)),
        ]);
      }
    }
  }
}
