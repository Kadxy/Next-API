import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
@Injectable()
export class CryptoService {
  // 静态计数器，用于确保同一毫秒内生成的字符串不会重复
  private static counter = 0;

  /**
   * 生成随机字符串，基于时间戳但无法推算出创建时间
   * @param length 字符串长度
   * @returns 随机字符串
   * @example
   * ```typescript
   * const randomString = this.cryptoService.generateRandomString();
   * console.log(randomString);
   * ```
   */
  generateRandomString(length: number = 48): string {
    // 获取当前时间戳（毫秒）
    const timestamp = Date.now();

    // 递增计数器并确保在0-999范围内循环
    CryptoService.counter = (CryptoService.counter + 1) % 1000;

    // 计数器补零，确保始终为3位
    const counterStr = CryptoService.counter.toString().padStart(3, '0');

    // 生成随机字节
    const bytes = randomBytes(32);

    // 将时间戳、计数器和随机字节组合并哈希，确保无法反推出时间
    const rawData = `${timestamp}${counterStr}${bytes.toString('hex')}`;
    const hashedData = createHash('sha256').update(rawData).digest('hex');

    // 截取指定长度
    return hashedData.substring(0, length);
  }

  /**
   * 计算字符串的哈希值
   * @param str 字符串
   * @returns 哈希值（长度固定为64位）
   * @example
   * ```typescript
   * const hash = this.cryptoService.hashString('hello');
   * console.log(hash);
   * ```
   */
  hashString(str: string): string {
    return createHash('sha3-256').update(str).digest('hex');
  }
}
