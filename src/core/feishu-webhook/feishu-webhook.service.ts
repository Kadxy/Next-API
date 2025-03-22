import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { firstValueFrom } from 'rxjs';
import {
  FeishuMessageInterface,
  FeishuPostMessage,
  FeishuTextMessage,
  PostContent,
} from './feishu-webhook.interface';
import { Agent as HttpsAgent } from 'node:https';

@Injectable()
export class FeishuWebhookService {
  private readonly logger = new Logger(FeishuWebhookService.name);
  private readonly url: string;
  private readonly secret: string;
  private readonly httpsAgent: HttpsAgent;

  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.url = this.config.getOrThrow<string>('FEISHU_WEBHOOK_URL');
    this.secret = this.config.getOrThrow<string>('FEISHU_WEBHOOK_SECRET');
    this.httpsAgent = new HttpsAgent();
  }

  // 发送纯文本消息
  async sendText(text: string) {
    const message: FeishuTextMessage = { msg_type: 'text', content: { text } };
    return this.send(message);
  }

  // 发送富文本消息
  async sendPost(content: PostContent) {
    const message: FeishuPostMessage = {
      msg_type: 'post',
      content: { post: { zh_cn: content } },
    };
    await this.send(message);
  }

  // 请求接口
  private async send(message: FeishuMessageInterface) {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const sign = this.generateSign(timestamp);

      const url = this.url;
      const data = { timestamp, sign, ...message };
      const headers = { 'Content-Type': 'application/json' };
      const config = {
        headers,
        httpsAgent: this.httpsAgent,
      };

      const response = await firstValueFrom(
        this.httpService.post(url, data, config),
      );

      if (response.status === HttpStatus.OK) {
        this.logger.log(['Send success:', JSON.stringify(response.data)].join(' '));
      }
    } catch (error) {
      this.logger.error(['Send failed:', error.message].join(' '));
    }
  }

  // 生成签名
  private generateSign(timestamp: string): string {
    const stringToSign = [timestamp, this.secret].join('\n');
    const hmac = crypto.createHmac('sha256', stringToSign);
    const signature = hmac.update('').digest();
    return signature.toString('base64');
  }
}
