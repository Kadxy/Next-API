// src/identity/identity.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma-mysql-client/client';
import {
  BusinessException,
  TooManyRequestsException,
} from '../../common/exceptions';
import { TencentEmailService } from '../../core/email/tencent/tencent-email.service';
import { UserService } from '../user/user.service';
import { EmailBindDto, EmailLoginDto } from './dto/email-login.dto';
import { SendEmailLoginCodeDto } from './dto/send-email-login-code.dto';
import { JwtTokenService } from './jwt.service';
import { Cache } from '@nestjs/cache-manager';
import {
  CACHE_FLAG,
  CACHE_KEYS,
  getCacheKey,
} from '../../core/cache/chche.constant';
import { generateRandomString } from 'src/utils';

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
    const codeCacheKey = getCacheKey(CACHE_KEYS.LOGIN_EMAIL_CODE, email);
    const limitCacheKey = getCacheKey(CACHE_KEYS.EMAIL_LIMIT, email);

    await this.verifyAndSetEmailLimit(email);

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

  // 发送邮箱绑定验证邮件
  async sendEmailBindVerifyEmail(
    userId: User['id'],
    data: SendEmailLoginCodeDto,
  ) {
    const { email } = data;
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new BusinessException('User not found');
    }

    const emailUser = await this.userService.getUserByEmail(email);
    if (emailUser) {
      throw new BusinessException('Email already bound to another user');
    }

    const limitCacheKey = getCacheKey(CACHE_KEYS.EMAIL_LIMIT, email);
    const tokenCacheKey = getCacheKey(
      CACHE_KEYS.EMAIL_BIND_TOKEN,
      userId,
      email,
    );

    if (await this.cacheManager.get(limitCacheKey)) {
      this.logger.debug(`Email[${email}] sending too frequently`);
      throw new TooManyRequestsException();
    }

    try {
      const token = generateRandomString(32);
      this.logger.debug(`Email[${email}], Token[${token}]`);

      await this.cacheManager.set(
        tokenCacheKey,
        token,
        CACHE_KEYS.EMAIL_BIND_TOKEN.EXPIRE,
      );

      await this.tencentEmailService.sendBindEmail(email, token);
    } catch (error) {
      this.cacheManager.del(limitCacheKey).catch();
      this.cacheManager.del(tokenCacheKey).catch();
      this.logger.error(error?.stack);
      throw new BusinessException();
    }
  }

  // 邮箱绑定
  async emailBind(userId: User['id'], data: EmailBindDto) {
    const { code, email } = data;
    await this.verifyAndSetEmailLimit(email);

    const tokenCacheKey = getCacheKey(
      CACHE_KEYS.EMAIL_BIND_TOKEN,
      userId,
      email,
    );
    const cachedCode = await this.cacheManager.get<string>(tokenCacheKey);
    if (!cachedCode || cachedCode !== code) {
      throw new BusinessException('Invalid code or code expired');
    }

    return await this.userService.bindThirdPartyAccount(userId, 'email', email);
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

  // 获取指定用户信息公开信息
  async getPublicUser(uid: User['uid']) {
    try {
      const user = await this.userService.getCachedLimitedUser(uid);
      if (!user) {
        throw new BusinessException('User not found');
      }

      const { displayName, avatar } = user;
      return { displayName, avatar };
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

  private async verifyAndSetEmailLimit(email: string) {
    const limitCacheKey = getCacheKey(CACHE_KEYS.EMAIL_LIMIT, email);

    // 检查发送频率限制
    if (await this.cacheManager.get(limitCacheKey)) {
      throw new TooManyRequestsException();
    }

    // 设置发送频率限制
    await this.cacheManager.set(
      limitCacheKey,
      CACHE_FLAG.EXIST,
      CACHE_KEYS.EMAIL_LIMIT.EXPIRE,
    );
  }
}
