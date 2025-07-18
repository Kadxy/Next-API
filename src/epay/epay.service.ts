import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import {
  CreateEpayOrderRequire,
  DeviceType,
  EpayCreateOrderRequest,
  EpayNotifyResult,
  EpayQueryOrderRequest,
  InterfaceType,
  PaymentMethod,
} from './interface/epay.interface';
import { Decimal } from '@prisma-detail-client/internal/prismaNamespace';
import { BusinessException } from 'src/common/exceptions';
import { UlidService } from 'src/core/ulid/ulid.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Prisma, Wallet } from '@prisma-main-client/client';
import { WalletService } from 'src/wallet/wallet.service';
import { TransactionStatus, TransactionType } from '@prisma-main-client/enums';

@Injectable()
export class EpayService {
  private readonly logger = new Logger(EpayService.name);
  private readonly baseUrl: string;
  private readonly merchantId: string;
  private readonly platformRsaPublicKey: string;
  private readonly merchantRsaPrivateKey: string;
  private readonly merchantMd5Secret: string;
  private readonly paths = {
    createOrderV1: '/mapi.php',
    createOrderV2: '/api/pay/create',
    queryOrderV1: '/api.php?act=order', // pid={pid}&key={key}&out_trade_no={out_trade_no}
    queryOrderV2: '/api/pay/query',
  };
  private readonly notifyUrl = 'https://api.apigrip.com/epay/notify';
  private readonly returnUrl = 'https://dashboard.apigrip.com/callback/epay';

  private readonly version: 'V1' | 'V2' = 'V1'; // V1: MD5签名, V2: RSA签名

  constructor(
    // private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly ulidService: UlidService,
    private readonly prismaService: PrismaService,
    private readonly walletService: WalletService,
  ) {
    const _getConfig = (key: string) => this.configService.getOrThrow(key);

    this.baseUrl = _getConfig('EPAY_BASE_URL');
    this.merchantId = _getConfig('EPAY_MERCHANT_PID');
    this.platformRsaPublicKey = this.formatRsaKey(
      _getConfig('EPAY_PLATFORM_RSA_PUBLIC_KEY'),
      'PUBLIC',
    );
    this.merchantRsaPrivateKey = this.formatRsaKey(
      _getConfig('EPAY_MERCHANT_RSA_PRIVATE_KEY'),
      'PRIVATE',
    );
    this.merchantMd5Secret = _getConfig('EPAY_MERCHANT_MD5_SECRET');
  }

  /** 获取支付价格, 前端传入美元额度, 返回系列价格信息 */
  getPrice(usdQuota: string) {
    const USD_Amount = new Decimal(usdQuota).toDecimalPlaces(2);
    const ORIGINAL_USD2CNY = new Decimal(8);

    if (USD_Amount.lt(0.01) || USD_Amount.gt(100000)) {
      throw new BusinessException('Invalid Quota: ' + usdQuota.toString());
    }

    let USD2CNY: Decimal;

    switch (true) {
      case USD_Amount.gte(5000):
        USD2CNY = new Decimal(4.0);
        break;
      case USD_Amount.gte(3000):
        USD2CNY = new Decimal(4.5);
        break;
      case USD_Amount.gte(2000):
        USD2CNY = new Decimal(4.8);
        break;
      case USD_Amount.gte(1000):
        USD2CNY = new Decimal(5.0);
        break;
      case USD_Amount.gte(500):
        USD2CNY = new Decimal(5.5);
        break;
      case USD_Amount.gte(200):
        USD2CNY = new Decimal(6.0);
        break;
      case USD_Amount.gte(100):
        USD2CNY = new Decimal(6.5);
        break;
      case USD_Amount.gte(50):
        USD2CNY = new Decimal(6.8);
        break;
      case USD_Amount.gte(10):
        USD2CNY = new Decimal(7.2);
        break;
      default:
        USD2CNY = ORIGINAL_USD2CNY;
        break;
    }

    return {
      quota: USD_Amount.toFixed(2),
      amount: USD2CNY.mul(USD_Amount)
        .toDecimalPlaces(2, Decimal.ROUND_UP)
        .toFixed(2),
      exchangeRate: USD2CNY.toFixed(2),
      originalExchangeRate: ORIGINAL_USD2CNY.toFixed(2),
      originalAmount: USD_Amount.mul(ORIGINAL_USD2CNY)
        .toDecimalPlaces(2, Decimal.ROUND_UP)
        .toFixed(2),
    };
  }

  async handleRecharge(
    userId: number,
    walletUid: Wallet['uid'],
    quota: string,
    payType: PaymentMethod,
    clientIp: string,
  ) {
    const price = this.getPrice(quota);
    const outTradeNo = this.ulidService.generate();

    const wallet = await this.walletService.getAccessibleWallet(
      { uid: walletUid },
      userId,
    );

    await this.prismaService.main.transaction.create({
      data: {
        businessId: outTradeNo,
        wallet: { connect: { id: wallet.id } },
        user: { connect: { id: userId } },
        type: TransactionType.RECHARGE,
        amount: price.amount,
        description: `Recharge - US$ ${quota}`,
        status: TransactionStatus.PENDING,
      },
    });

    const data: CreateEpayOrderRequire = {
      method: InterfaceType.web,
      device: DeviceType.pc,
      type: payType,
      out_trade_no: outTradeNo,
      name: `API-Grip Recharge - US$ ${quota}`,
      money: price.amount,
      clientip: clientIp,
    };

    return this.createEpayOrder(data);
  }

  async handleQueryOrder(trade_no: string) {
    this.logger.log(`* Query order: ${trade_no}`);

    if (this.version === 'V1') {
      return this.queryEpayOrderV1({ trade_no });
    } else {
      return this.queryEpayOrderV2({ trade_no });
    }
  }

  /** 处理易支付回调 */
  async handleNotify(query: EpayNotifyResult): Promise<boolean> {
    // 1. 验证签名
    if (!this.verifySignature(query)) {
      this.logger.error(
        `[Epay] Failed to verify signature: ${JSON.stringify(query)}`,
      );
      return false;
    }

    // 2. 验证业务状态
    if (query.trade_status !== 'TRADE_SUCCESS') {
      this.logger.warn(
        `[Epay] Non-success trade status received: ${JSON.stringify(query)}`,
      );
      return false;
    }

    try {
      await this.prismaService.main.$transaction(async (tx) => {
        // 3. (核心) 使用乐观锁，原子性地查找并更新订单
        // 我们直接尝试将一个处于 PENDING 状态的订单更新为 COMPLETED。
        // 如果回调被重复处理，第二次请求执行到这里时，
        // `status` 不再是 PENDING，`where` 条件不满足，`update` 将失败并抛出 P2025 错误。
        // 这比先 `find` 再 `update` 更高效，且并发更安全。
        const updatedTransaction = await tx.transaction.update({
          where: {
            businessId: query.out_trade_no,
            status: TransactionStatus.PENDING, // <-- 关键的乐观锁条件
          },
          data: {
            status: TransactionStatus.COMPLETED, // <-- 一次性更新到最终状态
          },
        });

        // 4. 如果更新成功，说明这是第一次有效处理，我们为用户充值
        await this.walletService.onRecharge(
          tx,
          { id: updatedTransaction.walletId },
          new Decimal(updatedTransaction.amount).toNumber(),
        );

        this.logger.log(
          `Recharge completed successfully: ${JSON.stringify({
            out_trade_no: query.out_trade_no,
            walletId: updatedTransaction.walletId,
            amount: updatedTransaction.amount,
          })}`,
        );
      });

      return true;
    } catch (error) {
      // 5. 精确处理错误
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        // P2025 错误意味着 `update` 没有找到匹配的记录。
        // 在这个场景下，这说明订单要么不存在，要么状态不是PENDING（即已被处理）。
        // 这是预期的幂等性行为，我们应该认为处理是“成功”的，并告知支付网关不要再重试。
        this.logger.log(
          `[Epay - expected error] Order ${query.out_trade_no} already processed or not found. Ignoring notification.`,
        );
        return false;
      }

      // 对于其他未知错误，记录日志并返回失败，让支付网关后续重试
      this.logger.error(
        `[Epay] Failed to process notification for ${query.out_trade_no}: ${error?.stack || error}`,
      );
      return false;
    }
  }

  /** 格式化 RSA 密钥为 PEM 格式 */
  private formatRsaKey(key: string, type: 'PUBLIC' | 'PRIVATE'): string {
    // 移除可能存在的空格和换行符
    const cleanKey = key.replace(/\s/g, '');

    // 添加 PEM 格式的头部和尾部
    const header = `-----BEGIN RSA ${type} KEY-----`;
    const footer = `-----END RSA ${type} KEY-----`;

    // 每64个字符添加一个换行符
    const formattedKey = cleanKey.match(/.{1,64}/g)?.join('\n') || cleanKey;

    return `${header}\n${formattedKey}\n${footer}`;
  }

  /** 创建易支付订单(内部使用) */
  private async createEpayOrder(dto: CreateEpayOrderRequire) {
    const { method, device, type, out_trade_no, name, money, clientip } = dto;

    const data: EpayCreateOrderRequest = {
      pid: Number(this.merchantId),
      ...(this.version === 'V2' && { method }),
      device,
      type,
      out_trade_no,
      notify_url: this.notifyUrl,
      return_url: this.returnUrl,
      name,
      money,
      clientip,
      timestamp: Math.floor(Date.now() / 1000).toString(), // 当前时间戳，10位整数，单位秒
      sign: '',
      sign_type: this.version === 'V1' ? 'MD5' : 'RSA',
    };

    data.sign = this.generateSignature(data);

    const urlencoded = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
      urlencoded.append(
        key,
        typeof value === 'string' ? value : JSON.stringify(value),
      );
    }

    const url = this.baseUrl + this.paths.createOrderV1;

    try {
      const res = await fetch(url, { method: 'POST', body: urlencoded });
      return res.json();
    } catch (error) {
      this.logger.error(`Create epay order failed: ${error.message}`);
      throw error;
    }
  }

  /** 查询易支付订单(内部使用) */
  private async queryEpayOrderV1(data: { trade_no: string }) {
    const url = new URL(this.baseUrl + this.paths.queryOrderV1);
    url.searchParams.set('pid', this.merchantId);
    url.searchParams.set('key', this.merchantMd5Secret);
    url.searchParams.set('trade_no', data.trade_no);

    try {
      const res = await fetch(url.toString());
      return res.json();
    } catch (error) {
      this.logger.error(`Query epay order failed: ${error.message}`);
      throw error;
    }
  }
  private async queryEpayOrderV2(data: { trade_no: string }) {
    const dataV2: EpayQueryOrderRequest = {
      pid: Number(this.merchantId),
      trade_no: data.trade_no,
      timestamp: Math.floor(Date.now() / 1000).toString(), // 当前时间戳，10位整数，单位秒
      sign: '',
      sign_type: this.version === 'V1' ? 'MD5' : 'RSA',
    };

    dataV2.sign = this.generateSignature(dataV2);

    const urlencoded = new URLSearchParams();
    for (const [key, value] of Object.entries(dataV2)) {
      urlencoded.append(
        key,
        typeof value === 'string' ? value : JSON.stringify(value),
      );
    }

    const url = this.baseUrl + this.paths.queryOrderV1;

    try {
      const res = await fetch(url, { method: 'GET', body: urlencoded });
      return res.json();
    } catch (error) {
      this.logger.error(`Query epay order failed: ${error.message}`);
      throw error;
    }
  }

  /** 过滤参数并生成待签名字符串，用于签名和验签 */
  private buildUnsignedString(params: Record<string, any>): string {
    const filteredParams = Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (
          value !== '' &&
          value != null &&
          !Array.isArray(value) &&
          typeof value !== 'object' &&
          key !== 'sign' &&
          key !== 'sign_type'
        ) {
          acc[key] = String(value);
        }
        return acc;
      },
      {} as Record<string, string>,
    );
    return Object.entries(filteredParams)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }

  /** 生成签名 */
  private generateSignature(params: Record<string, any>): string {
    // 1-2. 过滤参数并生成待签名字符串
    const unsignedString = this.buildUnsignedString(params);
    this.logger.debug(`unsigned string: ${unsignedString}`);
    // 3. 使用商户私钥签名
    if (this.version === 'V2') {
      const sign = crypto.createSign('RSA-SHA256');
      sign.update(unsignedString);
      sign.end();
      const signature = sign.sign(this.merchantRsaPrivateKey, 'base64');
      this.logger.debug(`RSA signature: ${signature}`);
      return signature;
    } else {
      const md5 = crypto.createHash('md5');
      md5.update(unsignedString + this.merchantMd5Secret);
      const signature = md5.digest('hex');
      this.logger.debug(`MD5 signature: ${signature}`);
      return signature;
    }
  }

  /** 验证签名 */
  private verifySignature(params: Record<string, any>): boolean {
    if (!params || typeof params !== 'object') {
      this.logger.error(
        `[verifySignature]: invalid params: ${JSON.stringify(params)}`,
      );
      return false;
    }

    const { sign, sign_type } = params;

    if (!sign && !sign_type) {
      this.logger.error(
        `[verifySignature]: no sign info: ${JSON.stringify(params)}`,
      );
      return false;
    }

    // 1-2. 过滤参数并生成待签名字符串
    const unsignedString = this.buildUnsignedString(params);
    this.logger.debug(`verify unsigned string: ${unsignedString}`);
    this.logger.debug(`verify signature: ${sign}, type: ${sign_type}`);
    // 3. 使用平台公钥验签
    try {
      if (sign_type === 'RSA') {
        const verify = crypto.createVerify('RSA-SHA256');
        verify.update(unsignedString);
        verify.end();
        return verify.verify(this.platformRsaPublicKey, sign, 'base64');
      } else {
        const md5 = crypto.createHash('md5');
        md5.update(unsignedString + this.merchantMd5Secret);
        const signature = md5.digest('hex');
        return signature === sign;
      }
    } catch (e) {
      this.logger.error('Signature verify error', e);
      return false;
    }
  }
}
