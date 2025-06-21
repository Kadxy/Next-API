import { Injectable, Logger } from '@nestjs/common';
import { get_encoding, Tiktoken } from 'tiktoken';
import { Jimp } from 'jimp';

export interface TikTokenResult {
  inputTokens: number;
  outputTokens: number;
}

export interface OpenAIRequest {
  messages: {
    role: string;
    content:
      | string
      | { type: string; text?: string; image_url?: { url: string } }[];
    name?: string;
  }[];
  tools?: any[];
  [key: string]: any;
}

@Injectable()
export class TiktokenService {
  private readonly logger = new Logger(TiktokenService.name);
  private encoder: Tiktoken;

  constructor() {
    this.encoder = get_encoding('cl100k_base');
  }

  /** 计算请求和响应的 token 数量 */
  public async countTokens(
    req: OpenAIRequest,
    resText: string,
  ): Promise<TikTokenResult> {
    return {
      inputTokens: await this.countRequestTokens(req),
      outputTokens: this.countText(resText),
    };
  }

  /** 计算文本的 token 数量 */
  private countText(text: string): number {
    return this.encoder.encode(text).length;
  }

  /** 计算请求体的 token 数量 */
  private async countRequestTokens(request: OpenAIRequest): Promise<number> {
    const { messages, tools } = request;

    let tokens = 0;

    // 计算消息的 token
    tokens += await this.countMessagesTokens(messages);

    // 计算工具的 token
    if (tools?.length) {
      tokens += this.countText(String(tools));
    }

    return tokens;
  }

  /** 计算消息数组的 token 数量 */
  private async countMessagesTokens(
    messages: OpenAIRequest['messages'],
  ): Promise<number> {
    const TOKENS_PER_MESSAGE = 3;
    const TOKENS_PER_NAME = 1;

    // 初始 3 个 token(回复消息的 token)
    let tokens = 3;

    for (const message of messages) {
      // 基础 token
      tokens += TOKENS_PER_MESSAGE;
      tokens += this.countText(message.role);

      if ('name' in message) {
        tokens += TOKENS_PER_NAME;
        tokens += this.countText(String(message.name));
      }

      // content 的 token
      const _msgContent = message.content;

      switch (true) {
        case typeof _msgContent === 'string':
          tokens += this.countText(_msgContent);
          break;
        case Array.isArray(_msgContent):
          tokens += await this.countContentArray(_msgContent);
          break;
        default:
          this.logger.debug(`Unsupported message type: ${typeof _msgContent}`);
          tokens += 0;
          break;
      }
    }

    return tokens;
  }

  /** 计算消息内容数组的 token 数量 */
  private async countContentArray(
    content: OpenAIRequest['messages'][number]['content'],
  ): Promise<number> {
    if (!Array.isArray(content)) return 0;

    let tokens = 0;

    for (const item of content) {
      switch (item.type) {
        case 'text':
          if (item.text) {
            tokens += this.countText(item.text);
          }
          break;
        case 'image_url':
          if (item.image_url) {
            tokens += await this.getImageTokenCount(item.image_url.url);
          }
          break;
        default:
          this.logger.debug(`Unsupported item type: ${item.type}`);
          tokens += this.countText(String(item));
          break;
      }
    }
    return tokens;
  }

  /** 获取图片的长、宽 */
  private async getImageTokenCount(base64Str: string): Promise<number> {
    // 读取图片
    const image = await Jimp.read(base64Str);
    const { width, height } = image.bitmap;
    this.logger.debug(`Image width: ${width}, height: ${height}`);

    // 计算图片的 token 数量 (向上取整)
    const heightBlock = Math.ceil(height / 600);
    const widthBlock = Math.ceil(width / 600);

    // 每 600px 算 1000 token
    return heightBlock * widthBlock * 1000;
  }
}
