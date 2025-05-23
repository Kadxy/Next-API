import { Injectable, Logger } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { RedemptionCode, User } from 'prisma/generated/prisma/client';
import { BusinessException } from 'src/common/exceptions';
import { CryptoService } from 'src/core/crypto/crypto.service';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class RedemptionService {
  //兑换码长度
  private static readonly REDEMPTION_CODE_LENGTH = 16;

  // 默认过期时间：30天
  private static readonly DEFAULT_EXPIRED_DURATION = 1000 * 60 * 60 * 24 * 30;

  /** 兑换码展示格式：ABCD-ABCD-ABCD-ABCD */
  private static formatDisplay(code: string) {
    return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}-${code.slice(12, 16)}`.toUpperCase();
  }

  /**
   * 规范化输入兑换码：移除破折号转小写，并校验长度
   */
  private static normalize(raw: string) {
    const normalized = raw.replace(/-/g, '').toLowerCase();

    if (normalized.length !== RedemptionService.REDEMPTION_CODE_LENGTH) {
      throw new BusinessException('Invalid redemption code');
    }

    return normalized;
  }

  private readonly logger = new Logger(RedemptionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  /**
   * 生成兑换码
   * @param amount 金额 (整数)
   * @param expiredDuration 过期时间（毫秒），默认30天
   * @returns 兑换码
   */
  async createRedemptionCode(
    amount: number,
    expiredDuration: number = RedemptionService.DEFAULT_EXPIRED_DURATION,
    remark: string = '',
  ): Promise<RedemptionCode & { displayCode: string }> {
    const code = this.generateRedemptionCode();

    const result = await this.prisma.redemptionCode.create({
      data: {
        code,
        amount,
        expiredAt: new Date(Date.now() + expiredDuration),
        remark,
      },
    });

    return {
      ...result,
      displayCode: RedemptionService.formatDisplay(result.code),
    };
  }

  /**
   * 兑换
   * @returns 兑换成功后用户最新余额
   */
  async doRedeem(codeInput: string, redeemerId: User['id']): Promise<Decimal> {
    const code = RedemptionService.normalize(codeInput);

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // 查询兑换码记录
        const record = await tx.redemptionCode.findUnique({ where: { code } });

        // 1. 基本校验
        if (!record || record.isDeleted) {
          throw new BusinessException('Invalid redemption code');
        }

        // 2. 是否已使用
        if (record.isUsed) {
          throw new BusinessException('Redemption code already used');
        }

        // 3. 是否过期
        if (record.expiredAt && record.expiredAt.getTime() < Date.now()) {
          throw new BusinessException('Redemption code expired');
        }

        // 标记为已使用
        await tx.redemptionCode.update({
          where: { id: record.id },
          data: { isUsed: true, redeemerId },
        });

        // 更新钱包余额
        const wallet = await tx.wallet.update({
          where: { userId: redeemerId },
          data: { balance: { increment: record.amount } },
          select: { balance: true },
        });

        return wallet.balance;
      });

      this.logger.debug(`Code[${code}] redeemed by User[${redeemerId}]`);
      return result;
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      this.logger.error(`Redeem failed: ${error?.stack || error}`);
      throw new BusinessException('Failed to redeem redemption code');
    }
  }

  /**
   * 获取所有兑换码
   * @returns 兑换码列表
   */
  async getAllRedemptionCodes() {
    return await this.prisma.redemptionCode.findMany({
      where: { isDeleted: false },
      include: {
        redeemer: {
          select: { id: true, uid: true, displayName: true, email: true },
        },
      },
    });
  }

  /**
   * 生成兑换码
   * @example abcdabcdabcdabcd
   * @returns 兑换码（小写）
   */
  private generateRedemptionCode() {
    return this.cryptoService
      .generateRandomString(RedemptionService.REDEMPTION_CODE_LENGTH)
      .toLowerCase();
  }
}
