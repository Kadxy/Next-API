import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

/**
 * Bloom Filter Service:
 * Used for efficiently determining whether an element may exist in a set.
 */
@Injectable()
export class BloomFilterService {
  private readonly filters: Map<string, BloomFilter> = new Map();

  /** 创建新的布隆过滤器 */
  createFilter(
    name: string,
    size: number = 10000,
    hashFunctions: number = 3,
  ): BloomFilter {
    const filter = new BloomFilter(size, hashFunctions);
    this.filters.set(name, filter);
    return filter;
  }

  /** 获取已存在的布隆过滤器 */
  getFilter(name: string): BloomFilter | undefined {
    return this.filters.get(name);
  }

  /** 原子性替换已存在的布隆过滤器实例 */
  replaceFilter(name: string, newFilter: BloomFilter): void {
    this.filters.set(name, newFilter);
  }

  /** 获取或创建布隆过滤器 */
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

  /** 删除布隆过滤器  */
  deleteFilter(name: string): boolean {
    return this.filters.delete(name);
  }
}

/** 布隆过滤器实现类 */
export class BloomFilter {
  private readonly bits: Uint8Array;
  private readonly size: number;
  private readonly hashFunctions: number;

  constructor(size: number = 10000, hashFunctions: number = 3) {
    this.size = size;
    this.hashFunctions = hashFunctions;
    this.bits = new Uint8Array(Math.ceil(size / 8));
  }

  /** 添加元素到布隆过滤器 */
  add(element: string): void {
    for (let i = 0; i < this.hashFunctions; i++) {
      const position = this.hash(element, i) % this.size;
      const byteIndex = Math.floor(position / 8);
      const bitIndex = position % 8;
      this.bits[byteIndex] |= 1 << bitIndex;
    }
  }

  /** 批量添加元素 */
  addAll(elements: string[]): void {
    for (const element of elements) {
      this.add(element);
    }
  }

  /** 检查元素是否可能存在 */
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

  /** 哈希函数 */
  private hash(element: string, seed: number): number {
    const hash = createHash('sha256')
      .update(element + seed.toString())
      .digest('hex')
      .substring(0, 8);

    return parseInt(hash, 16);
  }
}
