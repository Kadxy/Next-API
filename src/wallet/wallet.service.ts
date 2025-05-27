import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  Inject,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { getCacheKey, CACHE_KEYS } from 'src/core/cache/chche.constant';
import { BusinessException } from 'src/common/exceptions';
import { Prisma, User, Wallet, WalletMember } from '@prisma-client';
import { Decimal } from '@prisma-client/runtime/library';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  // Create wallet for user
  async createWallet(ownerId: User['id'], balance: Decimal = new Decimal(0)) {
    return this.prisma.wallet.create({
      data: { ownerId, balance },
    });
  }

  // Get database wallet
  async getDbWallet(
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

  // Get cached wallet
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

  // Validate user access to wallet and return wallet info
  async validateWalletAccess(walletUid: Wallet['uid'], userId: User['id']) {
    const wallet = await this.getCachedWallet({ uid: walletUid });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (!(await this.canAccess(wallet.id, userId))) {
      throw new ForbiddenException('You do not have access to this wallet');
    }

    return wallet;
  }

  // TODO: Add wallet member
  // TODO: Remove wallet member
  // TODO: Modify wallet member alias & credit limit

  // TODO: [IMPORTANT] Update wallet balance, later do in consumer system

  // Update wallet cache
  private async updateWalletCache(wallet: Wallet) {
    const cacheKeyId = getCacheKey(CACHE_KEYS.WALLET_INFO_ID, wallet.id);
    const cacheKeyUid = getCacheKey(CACHE_KEYS.WALLET_INFO_UID, wallet.uid);

    await this.cacheService.set(cacheKeyId, wallet);
    await this.cacheService.set(cacheKeyUid, wallet);
  }

  // Check if user has access to wallet (owner or active member)
  async canAccess(walletId: Wallet['id'], userId: User['id']) {
    const wallet = await this.getCachedWallet({ id: walletId });

    if (!wallet) {
      return false;
    }

    if (wallet.ownerId === userId) {
      return true;
    }

    return wallet.members.some((member) => member.userId === userId);
  }
}
