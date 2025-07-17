import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import {
  DeviceType,
  EpayCreateOrderRequest,
  EpayNotifyResult,
  EpayQueryOrderRequest,
  InterfaceType,
  PaymentMethod,
} from './interface/epay.interface';
import { FastifyReply } from 'fastify';

interface CreateOrderDto {
  method: InterfaceType;
  device: DeviceType;
  type: PaymentMethod;
  out_trade_no: string;
  name: string;
  money: string;
  clientip: string;
}

interface QueryOrderDto {
  out_trade_no?: string;
}

@Injectable()
export class EpayService {
  private readonly logger = new Logger(EpayService.name);
  private readonly baseUrl: string;
  private readonly merchantId: string;
  private readonly platformRsaPublicKey: string;
  private readonly merchantRsaPublicKey: string;
  private readonly merchantRsaPrivateKey: string;
  private readonly paths = {
    createOrder: '/api/pay/create',
    queryOrder: '/api/pay/query',
  };
  private readonly notifyUrl = 'https://api.apigrip.com/epay/notify';
  private readonly returnUrl = 'https://dashboard.apigrip.com/callback/epay';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const _getConfig = (key: string) => this.configService.getOrThrow(key);

    this.baseUrl = _getConfig('EPAY_BASE_URL');
    this.merchantId = _getConfig('EPAY_MERCHANT_PID');
    this.platformRsaPublicKey = _getConfig('EPAY_PLATFORM_RSA_PUBLIC_KEY');
    this.merchantRsaPublicKey = _getConfig('EPAY_MERCHANT_RSA_PUBLIC_KEY');
    this.merchantRsaPrivateKey = _getConfig('EPAY_MERCHANT_RSA_PRIVATE_KEY');
  }

  /** 处理易支付回调, TODO: 检测到成功要更新*/
  async handleNotify(query: EpayNotifyResult, reply: FastifyReply) {
    let success: boolean = true;

    const { sign, sign_type, ...rest } = query;

    if (!sign || !sign_type || sign_type.toLowerCase() !== 'rsa') {
      this.logger.error('Invalid sign or sign_type', query);
      success = false;
    }

    if (!this.verifySignature(rest)) {
      this.logger.error('Invalid signature', query);
      success = false;
    }

    if (!query.trade_status || query.trade_status !== 'TRADE_SUCCESS') {
      this.logger.error('Invalid trade_status', query);
      success = false;
    }

    reply.send({ success });
  }

  /** 创建易支付订单(内部使用) */
  private async createEpayOrder(dto: CreateOrderDto) {
    const { method, device, type, out_trade_no, name, money, clientip } = dto;

    const data: EpayCreateOrderRequest = {
      pid: Number(this.merchantId),
      method,
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
      sign_type: 'RSA',
    };

    data.sign = this.generateSignature(data);

    return this.httpService.post(this.baseUrl + this.paths.createOrder, data);
  }

  /** 查询易支付订单(内部使用) */
  private async queryEpayOrder(dto: QueryOrderDto) {
    const { out_trade_no } = dto;

    const data: EpayQueryOrderRequest = {
      pid: Number(this.merchantId),
      out_trade_no,
      timestamp: Math.floor(Date.now() / 1000).toString(), // 当前时间戳，10位整数，单位秒
      sign: '',
      sign_type: 'RSA',
    };

    data.sign = this.generateSignature(data);

    return this.httpService.post(this.baseUrl + this.paths.queryOrder, data);
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
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(unsignedString);
    sign.end();
    const signature = sign.sign(this.merchantRsaPrivateKey, 'base64');
    this.logger.debug(`signature: ${signature}`);
    return signature;
  }

  /** 验证签名 */
  private verifySignature(params: Record<string, any>): boolean {
    if (!params || typeof params !== 'object') {
      return false;
    }
    const { sign: signature } = params;
    if (!signature) return false;
    // 1-2. 过滤参数并生成待签名字符串
    const unsignedString = this.buildUnsignedString(params);
    this.logger.debug(`verify unsigned string: ${unsignedString}`);
    this.logger.debug(`verify signature: ${signature}`);
    // 3. 使用平台公钥验签
    try {
      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(unsignedString);
      verify.end();
      return verify.verify(this.platformRsaPublicKey, signature, 'base64');
    } catch (e) {
      this.logger.error('Signature verify error', e);
      return false;
    }
  }
}
