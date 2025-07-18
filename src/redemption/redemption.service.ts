import { Injectable, Logger } from '@nestjs/common';
import {
  Prisma,
  RedemptionCode,
  TransactionStatus,
  TransactionType,
  User,
  Wallet,
} from '@prisma-main-client/client';
import { Decimal } from '@prisma-main-client/internal/prismaNamespace';
import { BusinessException } from 'src/common/exceptions';
import { CryptoService } from 'src/core/crypto/crypto.service';
import { UlidService } from 'src/core/ulid/ulid.service';
import { PrismaService } from '../core/prisma/prisma.service';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class RedemptionService {
  private readonly logger = new Logger(RedemptionService.name);

  static readonly REDEMPTION_CODE_LENGTH = 4 * 6;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly walletService: WalletService,
    private readonly ulidService: UlidService,
  ) {}

  /**
   * 生成兑换码
   * @param amount 金额 (整数)
   * @param expiredAt 过期时间
   * @param remark 备注
   * @returns 兑换码
   */
  async createRedemptionCode(
    amount: number,
    remark?: string,
  ): Promise<RedemptionCode> {
    const code = this.generateRedemptionCode();

    // 转换为大写，每4个字符插入一个连字符
    const formattedCode = code
      .toLocaleUpperCase()
      .replace(/(.{4})(?=.)/g, '$1-');

    return this.prisma.main.redemptionCode.create({
      data: {
        code: formattedCode,
        amount,
        ...(remark && { remark }),
      },
    });
  }

  /**
   * 兑换兑换码 (最终优化版)
   * @param code 兑换码
   * @param walletUid 要充值的钱包UID
   * @param redeemerId 兑换者用户ID
   * @returns 兑换码包含的额度
   */
  async doRedeem(
    code: string,
    walletUid: Wallet['uid'],
    redeemerId: User['id'],
  ): Promise<Decimal> {
    // 1. (事务外) 预校验，用于快速失败
    const initialCodeRecord = await this.prisma.main.redemptionCode.findUnique({
      where: { code },
    });

    // 如果兑换码从一开始就不存在或已被使用，则直接拒绝，避免开启不必要的事务
    if (
      !initialCodeRecord ||
      initialCodeRecord.redeemedAt ||
      initialCodeRecord.redeemBusinessId ||
      initialCodeRecord.redeemerId ||
      initialCodeRecord.walletId
    ) {
      throw new BusinessException('兑换码不存在或已被使用');
    }

    try {
      const businessId = this.ulidService.generate();

      // 2. 将所有写操作放入一个原子事务中执行
      const redeemedAmount = await this.prisma.main.$transaction(async (tx) => {
        // 3. (事务内) 使用带乐观锁的更新作为核心操作
        // 这是防止并发的关键：原子性地“检查并更新”
        // 我们尝试更新一个 `redeemedAt` 为 `null` 的记录。
        // 如果此时有另一个并发请求已经兑换了它，`redeemedAt` 将不再是 `null`，
        // `update` 操作会因为 `where` 条件不匹配而失败，抛出 P2025 错误。
        const updatedCode = await tx.redemptionCode.update({
          where: {
            code: code,
            redeemedAt: null, // <-- 关键的乐观锁条件
          },
          data: {
            redeemedAt: new Date(),
            redeemerId,
            redeemBusinessId: businessId,
          },
        });

        // 如果更新成功，说明我们已成功“占有”了这个兑换码，可以安全地进行后续操作

        // 4. 更新钱包余额
        const updatedWallet = await this.walletService.onRecharge(
          tx,
          { uid: walletUid },
          updatedCode.amount, // 使用更新后返回的记录，确保数据一致
        );

        // 5. 创建一条“已完成”的交易记录
        await tx.transaction.create({
          data: {
            businessId,
            walletId: updatedWallet.id,
            userId: redeemerId,
            type: TransactionType.REDEMPTION,
            amount: updatedCode.amount,
            description: `Redemption, code: [${code.slice(0, 4)}***${code.slice(-4)}]`,
            status: TransactionStatus.COMPLETED, // 直接创建为完成状态
          },
        });

        this.logger.debug(
          `Redeem success: ${JSON.stringify({ code, redeemerId, walletUid, businessId })}`,
        );

        // 从更新后的记录中返回金额
        return updatedCode.amount;
      });

      return new Decimal(redeemedAmount).toSignificantDigits(2);
    } catch (error) {
      // 6. 精确的错误处理
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // 捕获因乐观锁更新失败（记录找不到）抛出的P2025错误
        // 这几乎可以肯定是由并发竞争引起的
        if (error.code === 'P2025') {
          throw new BusinessException('兑换码已被使用，请勿重复操作');
        }
      }

      if (error instanceof BusinessException) {
        throw error;
      }

      this.logger.error(
        `Redeem failed for code [${code}]: ${error?.stack || error}`,
      );
      throw new BusinessException('兑换失败，请稍后重试');
    }
  }

  /**
   * 获取所有兑换码
   * @returns 兑换码列表
   */
  async getAllRedemptionCodes() {
    return this.prisma.main.redemptionCode.findMany();
  }

  /**
   * 生成兑换码
   * @example undecidability
   * @returns 兑换码（小写）
   */
  private generateRedemptionCode() {
    return this.cryptoService
      .generateRandomString(RedemptionService.REDEMPTION_CODE_LENGTH)
      .toLowerCase();
  }
}
