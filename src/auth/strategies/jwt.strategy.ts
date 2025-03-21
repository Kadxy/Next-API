import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_KEYS, getCacheKey } from '../../common/constants';

export interface JwtPayload {
  uid: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // 优先从缓存获取用户信息
    const cacheKey = getCacheKey('USER', payload.uid);
    const cachedUser = await this.cacheManager.get(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    // 如果缓存中没有，则从数据库获取
    const user = await this.prisma.user.findUnique({
      where: { uid: payload.uid },
      select: {
        id: true,
        uid: true,
        displayName: true,
        email: true,
        phone: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('无效的令牌或用户未激活');
    }

    // 将用户信息缓存起来，用于后续请求
    await this.cacheManager.set(cacheKey, user, CACHE_KEYS.USER.EXPIRE);

    return user;
  }
}
