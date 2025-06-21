import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

@Injectable()
export class UlidService {
  /**
   * 生成一个新的 ULID
   * @returns 26 字符的 ULID 字符串
   * @example "01ARZ3NDEKTSV4RRFFQ69G5FAV"
   */
  generate(): string {
    return ulid();
  }

  /**
   * 从 ULID 中提取时间戳
   * @param id ULID 字符串
   * @returns Unix 时间戳（毫秒）
   */
  //   extractTimestamp(id: string): number {
  //     // ULID 的前 10 个字符代表时间戳
  //     const timestampPart = id.substring(0, 10);
  //     // 将 Crockford's Base32 转换为数字
  //     const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  //     let timestamp = 0;

  //     for (const char of timestampPart) {
  //       timestamp = timestamp * 32 + ENCODING.indexOf(char);
  //     }

  //     return timestamp;
  //   }

  /**
   * 从 ULID 中提取日期
   * @param id ULID 字符串
   * @returns Date 对象
   */
  //   extractDate(id: string): Date {
  //     return new Date(this.extractTimestamp(id));
  //   }

  /**
   * 验证字符串是否为有效的 ULID
   * @param id 待验证的字符串
   * @returns 是否为有效的 ULID
   */
  //   isValid(id: string): boolean {
  //     // ULID 必须是 26 个字符
  //     if (id.length !== 26) return false;

  //     // 检查是否只包含 Crockford's Base32 字符
  //     const VALID_CHARS = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]+$/;
  //     return VALID_CHARS.test(id);
  //   }

  /**
   * 生成指定时间的 ULID（用于测试或特殊场景）
   * @param seedTime 种子时间（Unix 时间戳，毫秒）
   * @returns ULID 字符串
   */
  //   generateWithSeed(seedTime: number): string {
  //     return ulid(seedTime);
  //   }
}
