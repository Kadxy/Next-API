import { Injectable, Logger } from '@nestjs/common';
import { RedemptionCode, User } from 'prisma/generated';
import { Decimal } from 'prisma/generated/runtime/library';
import { BusinessException } from 'src/common/exceptions';
import { CryptoService } from 'src/core/crypto/crypto.service';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class RedemptionService {
  static readonly REDEMPTION_CODE_LENGTH = 24;

  constructor(
    private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
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
    expiredAt?: Date,
    remark?: string,
  ): Promise<RedemptionCode> {
    const code = this.generateRedemptionCode();

    return this.prisma.redemptionCode.create({
      data: {
        code,
        amount,
        ...(expiredAt && { expiredAt }),
        ...(remark && { remark }),
      },
    });
  }

  /**
   * 兑换兑换码
   * @returns 兑换码包含的额度
   */
  async doRedeem(code: string, redeemerId: User['id']): Promise<Decimal> {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // 1. 查询兑换码记录
        const record = await tx.redemptionCode.findUnique({ where: { code } });

        // 2.1. 存在性校验
        if (!record) {
          throw new BusinessException('Invalid redemption code');
        }

        // 2.2. 是否已使用
        if (record.redeemedAt) {
          throw new BusinessException('Redemption code already used');
        }

        // 2.3. 是否过期
        if (record.expiredAt && record.expiredAt.getTime() < Date.now()) {
          throw new BusinessException('Redemption code expired');
        }

        // 3. 更新兑换码记录
        await tx.redemptionCode.update({
          where: { id: record.id },
          data: { redeemedAt: new Date(), redeemerId },
        });

        // TODO: 4. 更新钱包余额

        return new Decimal(record.amount).toSignificantDigits(2);
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
    return this.prisma.redemptionCode.findMany();
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
