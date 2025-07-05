// src/identity/identity.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma-client/client';
import {
  BusinessException,
  TooManyRequestsException,
} from '../../common/exceptions';
import { TencentEmailService } from '../../core/email/tencent/tencent-email.service';
import { UserService } from '../user/user.service';
import { EmailLoginDto } from './dto/email-login.dto';
import { SendEmailLoginCodeDto } from './dto/send-email-login-code.dto';
import { JwtTokenService } from './jwt.service';
import { Cache } from '@nestjs/cache-manager';
import {
  CACHE_FLAG,
  CACHE_KEYS,
  getCacheKey,
} from '../../core/cache/chche.constant';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly tencentEmailService: TencentEmailService,
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly cacheManager: Cache,
  ) {}

  // 发送邮箱登录验证码
  async sendEmailLoginCode(data: SendEmailLoginCodeDto) {
    const { email } = data;
    const limitCacheKey = getCacheKey(CACHE_KEYS.EMAIL_LIMIT, email);
    const codeCacheKey = getCacheKey(CACHE_KEYS.LOGIN_EMAIL_CODE, email);

    // 检查发送频率限制
    if (await this.cacheManager.get(limitCacheKey)) {
      this.logger.debug(`Email[${email}] sending too frequently`);
      throw new TooManyRequestsException();
    }

    try {
      // 生成验证码
      const code = this.generateRandomCode();
      this.logger.debug(`Email[${email}], Code[${code}]`);

      // 并行发送验证码和设置缓存
      await Promise.all([
        this.tencentEmailService.sendLoginCode(email, code),
        this.cacheManager.set(
          codeCacheKey,
          code,
          CACHE_KEYS.LOGIN_EMAIL_CODE.EXPIRE,
        ),
        this.cacheManager.set(
          limitCacheKey,
          CACHE_FLAG.EXIST,
          CACHE_KEYS.EMAIL_LIMIT.EXPIRE,
        ),
      ]);
    } catch (error) {
      this.cacheManager.del(limitCacheKey).catch();
      this.cacheManager.del(codeCacheKey).catch();
      this.logger.error(error?.stack);
      throw new BusinessException();
    }
  }

  // 邮箱登录
  async emailLogin(data: EmailLoginDto) {
    const { email, code } = data;

    // 检查验证码
    const cachedCode = await this.cacheManager.get<string>(
      getCacheKey(CACHE_KEYS.LOGIN_EMAIL_CODE, email),
    );

    if (!cachedCode || cachedCode !== code) {
      this.logger.debug(
        `Email[${email}], Code[${code}], CachedCode[${cachedCode}]`,
      );
      throw new BusinessException('Invalid code or code expired');
    }

    try {
      // 尝试获取用户信息
      let user = await this.userService.getUserByEmail(email);

      // 用户不存在则创建新用户
      if (!user) {
        user = await this.userService.createUser({ email });
      }

      // 5. 生成 JWT token
      const token = await this.jwtTokenService.sign(user);

      return { user, token };
    } catch (error) {
      this.logger.error(error?.stack);
      throw new BusinessException();
    }
  }

  // 获取当前用户信息
  async getSelf(uid: User['uid']) {
    try {
      const user = await this.userService.getCachedLimitedUser(uid);
      if (!user) {
        throw new BusinessException('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error(error?.stack);
      throw new BusinessException();
    }
  }

  // 注销登录
  async logout(token: string) {
    try {
      await this.jwtTokenService.invalidate(token);
    } catch (error) {
      this.logger.error(error?.stack);
      throw new BusinessException();
    }
  }

  // 注销所有设备
  async logoutAll(uid: User['uid']) {
    try {
      await this.jwtTokenService.invalidateAll(uid);
    } catch (error) {
      this.logger.error(error?.stack);
      throw new BusinessException();
    }
  }

  // 更新用户显示名称
  async updateDisplayName(uid: User['uid'], displayName: string) {
    try {
      return this.userService.updateDisplayName(uid, displayName);
    } catch (error) {
      this.logger.error(error?.stack);
      throw new BusinessException();
    }
  }

  // 生成验证码(数字+字母)
  private generateRandomCode(length: number = 6): string {
    return Math.random()
      .toString(36)
      .toLocaleUpperCase()
      .padEnd(length, '0')
      .substring(2, 2 + length);
  }
}
