import { Injectable, Logger } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UnauthorizedException } from 'src/common/exceptions/business.exception';
import { JwtPayload, JwtSignPayload } from './auth.guard';
import { Cache } from '@nestjs/cache-manager';
import {
  CACHE_FLAG,
  CACHE_KEYS,
  getCacheKey,
} from '../../core/cache/chche.constant';
import { UserService } from '../user/user.service';

export enum JWT_ERR_MESSAGE {
  /** No token/Not logged in */
  NO_LOGIN = 'Please login first',

  /** Token expired */
  TOKEN_EXPIRED = 'Token expired',

  /** Token invalidated (version mismatch/blacklisted) */
  TOKEN_INVALIDATED = 'Token invalidated',

  /** Parse error */
  INVALID_TOKEN = 'Invalid token',
}

@Injectable()
export class JwtTokenService {
  private readonly logger = new Logger(JwtTokenService.name);

  constructor(
    private readonly jwtService: NestJwtService,
    private readonly userService: UserService,
    private readonly cacheService: Cache,
  ) {}

  extract(authorization: any): string {
    if (!authorization) {
      throw new UnauthorizedException(JWT_ERR_MESSAGE.NO_LOGIN);
    } else if (typeof authorization !== 'string') {
      throw new UnauthorizedException(JWT_ERR_MESSAGE.INVALID_TOKEN);
    }

    const [type, token] = authorization.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException(JWT_ERR_MESSAGE.NO_LOGIN);
    }
    return token;
  }

  async sign(user: User): Promise<string> {
    // Get user info
    const { uid } = user;

    // Get current token version
    const version = await this.getVersion(uid);

    // Assemble payload
    const payload: JwtSignPayload = { uid, version };

    this.logger.debug(`token signed, payload: ${JSON.stringify(payload)}`);

    // Return JWT token
    return this.jwtService.signAsync(payload);
  }

  async verify(jwtToken: string): Promise<User> {
    try {
      // Verify signature
      const payload = await this.jwtService.verifyAsync<JwtPayload>(jwtToken);

      // Check blacklist
      await this.checkBlacklist(jwtToken);

      // Check version
      const version = await this.getVersion(payload.uid);

      if (payload.version !== version) {
        throw new UnauthorizedException(JWT_ERR_MESSAGE.TOKEN_EXPIRED);
      }

      this.logger.debug(`Token verified: ${JSON.stringify(payload)}`);

      // Return user info
      return this.userService.getCachedUser(payload.uid);
    } catch (error) {
      throw error instanceof UnauthorizedException
        ? error
        : new UnauthorizedException(JWT_ERR_MESSAGE.INVALID_TOKEN);
    }
  }

  async invalidate(jwtToken: string): Promise<void> {
    // Verify signature
    const payload = await this.jwtService.verifyAsync<JwtPayload>(jwtToken);

    // Calculate remaining valid time (seconds)
    const expiresIn = payload.exp - Math.floor(Date.now() / 1000);

    await this.cacheService.set(
      getCacheKey(CACHE_KEYS.JWT_BLACKLIST, jwtToken),
      CACHE_FLAG.EXIST,
      Math.max(0, expiresIn),
    );

    this.logger.debug(`Token[${jwtToken}] invalidated`);
  }

  async invalidateAll(uid: User['uid']): Promise<void> {
    const currentVersion = await this.getVersion(uid);

    await this.cacheService.set(
      getCacheKey(CACHE_KEYS.JWT_VERSION, uid),
      currentVersion + 1,
      CACHE_KEYS.JWT_VERSION.EXPIRE,
    );

    this.logger.debug(`All tokens invalidated for user[${uid}]`);
  }

  private async checkBlacklist(jwtToken: string): Promise<void> {
    const exists = await this.cacheService.get(
      getCacheKey(CACHE_KEYS.JWT_BLACKLIST, jwtToken),
    );

    if (exists) {
      this.logger.debug(`Token[${jwtToken}] in blacklist`);
      throw new UnauthorizedException(JWT_ERR_MESSAGE.TOKEN_INVALIDATED);
    }
  }

  private async getVersion(uid: User['uid']): Promise<number> {
    const version = await this.cacheService.get<number>(
      getCacheKey(CACHE_KEYS.JWT_VERSION, uid),
    );

    return version || 0;
  }
}
