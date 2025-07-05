import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { getCacheKey, CACHE_KEYS } from 'src/core/cache/chche.constant';
import { BusinessException } from 'src/common/exceptions';
import { Prisma, User, Wallet, WalletMember } from '@prisma-client/client';
import {
  OWNER_WALLET_QUERY_OMIT,
  OWNER_WALLET_QUERY_WALLETMEMBER_SELECT,
  SIMPLE_WALLET_QUERY_SELECT,
} from 'prisma/query.constant';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  /**
   * Get cached wallet info, if not cached, get from database and cache it
   * @param where - wallet id or uid
   * @returns wallet info if cached or found in database, null only if not found in database
   * @throws BusinessException if invalid wallet ID or UID
   */
  async getCachedWallet(
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

    const cachedWallet = await this.cacheService.get(cacheKey);

    if (cachedWallet) {
      return cachedWallet as Wallet & { members: WalletMember[] };
    }

    return this.getDbWallet(where);
  }

  /**
   * @param where - wallet id or uid
   * @param userId - user id
   * @param isOwner - whether to check owner permission, default is false
   * @throws {BusinessException} if wallet not found or permission denied
   * @returns wallet info if has access, otherwise throw error
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

  /**
   * List user available wallets
   * @param userId - user id
   * @returns wallets that user has access to
   */
  async listUserAvailableWallets(userId: User['id']) {
    // 先查用户作为 owner 的 wallet
    const ownerWallets = await this.prisma.wallet.findMany({
      where: { ownerId: userId },
      select: SIMPLE_WALLET_QUERY_SELECT,
    });

    // 如果用户没有 owner 的 wallet，则创建一个
    if (ownerWallets.length === 0) {
      this.logger.log(`User ${userId} has no owner wallet, creating one`);

      const newWallet = await this.prisma.wallet.create({
        data: { ownerId: userId },
        select: SIMPLE_WALLET_QUERY_SELECT,
      });
      ownerWallets.push(newWallet);
    }

    // 再查用户作为 member 的 wallet
    const memberWallets = await this.prisma.walletMember.findMany({
      where: { userId },
      select: {
        wallet: {
          select: SIMPLE_WALLET_QUERY_SELECT,
        },
        creditLimit: true,
        creditUsed: true,
      },
    });

    return [...ownerWallets, ...memberWallets];
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

    // 2. 根据提供的 memberUid 查询 userId
    const memberUserToAdd = await this.prisma.user.findUnique({
      where: { uid: memberUid, isDeleted: false },
    });

    if (!memberUserToAdd) {
      throw new BusinessException('User not found');
    }

    // 3. 检查 member 是否已经加入钱包且有效
    if (
      authorizedWallet.members.some(
        (existingMember) =>
          existingMember.userId === memberUserToAdd.id &&
          existingMember.isActive,
      )
    ) {
      throw new BusinessException('User already in wallet');
    }

    // 4. 更新或创建成员记录
    await this.prisma.walletMember.upsert({
      where: {
        walletId_userId: {
          walletId: authorizedWallet.id,
          userId: memberUserToAdd.id,
        },
      },
      update: {
        isActive: true,
        alias,
        creditLimit,
        creditUsed: { set: 0 },
      },
      create: {
        wallet: { connect: { id: authorizedWallet.id } },
        user: { connect: { id: memberUserToAdd.id } },
        isActive: true,
        alias,
        creditLimit,
        creditUsed: 0,
      },
    });
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

    // 2. 根据提供的 memberUid 查询 userId
    const memberUserToRemove = await this.prisma.user.findUnique({
      where: { uid: memberUid, isDeleted: false },
    });

    if (!memberUserToRemove) {
      throw new BusinessException('User not found');
    }

    // 3. 检查 member 是否已经加入钱包且有效
    if (
      authorizedWallet.members.some(
        (existingMember) =>
          existingMember.userId === memberUserToRemove.id &&
          existingMember.isActive,
      )
    ) {
      throw new BusinessException('User not in wallet');
    }

    // 4. 更新记录，将 isActive 设置为 false
    await this.prisma.walletMember.update({
      where: {
        walletId_userId: {
          walletId: authorizedWallet.id,
          userId: memberUserToRemove.id,
        },
      },
      data: {
        isActive: false,
      },
    });
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

    // 2. 根据提供的 memberUid 查询 userId
    const memberUserToUpdate = await this.prisma.user.findUnique({
      where: { uid: memberUid, isDeleted: false },
    });

    if (!memberUserToUpdate) {
      throw new BusinessException('User not found');
    }

    // 3. 检查 member 是否已经加入钱包且有效
    const member = authorizedWallet.members.find(
      (member) => member.userId === memberUserToUpdate.id && member.isActive,
    );

    if (!member) {
      throw new BusinessException('Member not found');
    }

    // 4. 更新记录
    await this.prisma.walletMember.update({
      where: { id: member.id },
      data: {
        ...(alias && { alias }),
        ...(creditLimit && { creditLimit }),
        ...(resetCreditUsed && { creditUsed: { set: 0 } }),
      },
    });
  }

  async getWalletDetail(walletUid: Wallet['uid']) {
    return this.prisma.wallet.findUnique({
      where: { uid: walletUid },
      include: {
        members: {
          where: { isActive: true },
          select: OWNER_WALLET_QUERY_WALLETMEMBER_SELECT,
        },
      },
      omit: OWNER_WALLET_QUERY_OMIT,
    });
  }

  // Get database wallet
  private async getDbWallet(
    where: Prisma.WalletWhereUniqueInput,
  ): Promise<(Wallet & { members: WalletMember[] }) | null> {
    const wallet = await this.prisma.wallet.findUnique({
      where,
      include: { members: true },
    });

    if (wallet) {
      this.updateWalletCache(wallet).catch(() => {
        this.logger.error(`Failed to cache wallet ${wallet.id}`);
      });
    }

    return wallet;
  }

  // Update wallet cache
  private async updateWalletCache(wallet: Wallet) {
    const cacheKeyId = getCacheKey(CACHE_KEYS.WALLET_INFO_ID, wallet.id);
    const cacheKeyUid = getCacheKey(CACHE_KEYS.WALLET_INFO_UID, wallet.uid);

    await this.cacheService.set(cacheKeyId, wallet);
    await this.cacheService.set(cacheKeyUid, wallet);
  }
}
