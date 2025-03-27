import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

/**
 * 布隆过滤器服务
 * 用于高效地判断一个元素是否可能存在于集合中
 * 注意：布隆过滤器可能产生假阳性（误报），但不会产生假阴性（漏报）
 */
@Injectable()
export class BloomFilterService {
  private readonly filters: Map<string, BloomFilter> = new Map();

  /**
   * 创建一个新的布隆过滤器
   * @param name 过滤器名称
   * @param size 位数组大小，默认10000
   * @param hashFunctions 哈希函数数量，默认3
   * @returns 布隆过滤器实例
   */
  createFilter(
    name: string,
    size: number = 10000,
    hashFunctions: number = 3,
  ): BloomFilter {
    const filter = new BloomFilter(size, hashFunctions);
    this.filters.set(name, filter);
    return filter;
  }

  /**
   * 获取一个已存在的布隆过滤器
   * @param name 过滤器名称
   * @returns 布隆过滤器实例，不存在则返回undefined
   */
  getFilter(name: string): BloomFilter | undefined {
    return this.filters.get(name);
  }

  /**
   * 获取或创建布隆过滤器
   * @param name 过滤器名称
   * @param size 位数组大小，默认10000
   * @param hashFunctions 哈希函数数量，默认3
   * @returns 布隆过滤器实例
   */
  getOrCreateFilter(
    name: string,
    size: number = 10000,
    hashFunctions: number = 3,
  ): BloomFilter {
    let filter = this.filters.get(name);
    if (!filter) {
      filter = this.createFilter(name, size, hashFunctions);
    }
    return filter;
  }

  /**
   * 删除一个布隆过滤器
   * @param name 过滤器名称
   * @returns 是否成功删除
   */
  deleteFilter(name: string): boolean {
    return this.filters.delete(name);
  }

  /**
   * 获取所有布隆过滤器的名称
   * @returns 过滤器名称数组
   */
  getFilterNames(): string[] {
    return Array.from(this.filters.keys());
  }
}

/**
 * 布隆过滤器实现类
 */
export class BloomFilter {
  private readonly bits: Uint8Array;
  private readonly size: number;
  private readonly hashFunctions: number;

  /**
   * 创建布隆过滤器实例
   * @param size 位数组大小
   * @param hashFunctions 哈希函数数量
   */
  constructor(size: number = 10000, hashFunctions: number = 3) {
    this.size = size;
    this.hashFunctions = hashFunctions;
    this.bits = new Uint8Array(Math.ceil(size / 8));
  }

  /**
   * 向布隆过滤器添加元素
   * @param element 要添加的元素
   */
  add(element: string): void {
    for (let i = 0; i < this.hashFunctions; i++) {
      const position = this.hash(element, i) % this.size;
      const byteIndex = Math.floor(position / 8);
      const bitIndex = position % 8;
      this.bits[byteIndex] |= 1 << bitIndex;
    }
  }

  /**
   * 批量添加元素到布隆过滤器
   * @param elements 要添加的元素数组
   */
  addAll(elements: string[]): void {
    for (const element of elements) {
      this.add(element);
    }
  }

  /**
   * 检查元素是否可能存在于集合中
   * @param element 要检查的元素
   * @returns 如果元素可能存在返回true，如果一定不存在返回false
   */
  mightContain(element: string): boolean {
    for (let i = 0; i < this.hashFunctions; i++) {
      const position = this.hash(element, i) % this.size;
      const byteIndex = Math.floor(position / 8);
      const bitIndex = position % 8;
      if ((this.bits[byteIndex] & (1 << bitIndex)) === 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * 获取布隆过滤器的当前大小
   * @returns 位数组大小
   */
  getSize(): number {
    return this.size;
  }

  /**
   * 获取布隆过滤器的哈希函数数量
   * @returns 哈希函数数量
   */
  getHashFunctionsCount(): number {
    return this.hashFunctions;
  }

  /**
   * 估计布隆过滤器中的元素数量
   * @returns 估计的元素数量
   */
  estimateElementCount(): number {
    let setBits = 0;
    for (let i = 0; i < this.bits.length; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.bits[i] & (1 << j)) {
          setBits++;
        }
      }
    }

    // 使用布隆过滤器的数学公式估算元素数量
    // n ≈ -m * ln(1 - k/m) / k
    // 其中m是位数组大小，k是哈希函数数量
    return Math.round(
      -(this.size / this.hashFunctions) * Math.log(1 - setBits / this.size),
    );
  }

  /**
   * 清空布隆过滤器
   */
  clear(): void {
    this.bits.fill(0);
  }

  /**
   * 哈希函数
   * @param element 要哈希的元素
   * @param seed 哈希种子
   * @returns 哈希值
   */
  private hash(element: string, seed: number): number {
    // 使用更强健的哈希算法
    const hash = createHash('sha256')
      .update(element + seed.toString())
      .digest('hex')
      .substring(0, 8);

    return parseInt(hash, 16);
  }
}
