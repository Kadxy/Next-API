import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../core/prisma/prisma.service';
import { JwtPayload } from './strategies/jwt.strategy';
import { User } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_KEYS, getCacheKey } from 'src/core/cache/chche.constant';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /** Generate JWT token for a user */
  async sign(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  /** Validate a user by uid */
  async validateUser(uid: string): Promise<User | null> {
    const cacheKey = getCacheKey(CACHE_KEYS.USER_INFO, uid);
    const cachedUser = await this.cacheManager.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    // If not in cache, get from database
    const user = await this.prisma.user.findUnique({ where: { uid } });

    if (user) {
      // Cache user for future requests
      await this.cacheManager.set(cacheKey, user, CACHE_KEYS.USER_INFO.EXPIRE); // Cache for 1 hour
    }

    return user;
  }

  /** Validate an API key */
  async validateApiKey(apiKey: string): Promise<any | null> {
    // TODO: Implement API key validation once the schema is updated
    // This is a placeholder that will be implemented when the API key model is added to the Prisma schema
    console.log(`API Key validation requested for: ${apiKey}`);
    return null;
  }
}
