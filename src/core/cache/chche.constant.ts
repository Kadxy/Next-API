// https://docs.nestjs.com/techniques/caching#interacting-with-the-cache-store

import { days, hours, minutes } from '@nestjs/throttler';

// Default cache TTL: 5 minutes
export const DEFAULT_CACHE_TTL = minutes(5);

export const CACHE_KEYS = {
  USER_INFO_UID: {
    KEY: 'user-info:{uid}',
    EXPIRE: minutes(5),
  },
  EMAIL_LIMIT: {
    KEY: 'email-limit:{email}',
    EXPIRE: minutes(1),
  },
  LOGIN_EMAIL_CODE: {
    KEY: 'login-email-code:{email}',
    EXPIRE: minutes(10),
  },
  JWT_VERSION: {
    KEY: 'jwt-version:{uid}',
    EXPIRE: days(1),
  },
  JWT_BLACKLIST: {
    KEY: 'jwt-blacklist:{token}',
    EXPIRE: days(1),
  },
  GITHUB_STATE: {
    KEY: 'github-state:{state}',
    EXPIRE: minutes(3),
  },
  GOOGLE_STATE: {
    KEY: 'google-state:{state}',
    EXPIRE: minutes(3),
  },
  WEBAUTHN_REGISTER_OPTIONS: {
    KEY: 'webauthn-register-options:{userId}',
    EXPIRE: minutes(5),
  },
  WEBAUTHN_AUTHENTICATION_OPTIONS: {
    KEY: 'webauthn-authentication-options:{userId}',
    EXPIRE: minutes(5),
  },
  API_KEY: {
    KEY: 'api-key:{hashKey}',
    EXPIRE: minutes(10),
  },
  WALLET_INFO_ID: {
    KEY: 'wallet-info:{id}',
    EXPIRE: minutes(1),
  },
  WALLET_INFO_UID: {
    KEY: 'wallet-info:{uid}',
    EXPIRE: minutes(1),
  },
  WALLET_MEMBER_CREDIT_INSUFFICIENT: {
    KEY: 'wallet-member-credit-insufficient:{walletId}:{userId}',
    EXPIRE: hours(3),
  },
} as const;

export const CACHE_FLAG = {
  EXIST: '1',
} as const;

/**
 * 获取缓存键。
 * @param cache 缓存信息
 * @param params 用来替换占位符的参数列表，可以是字符串或数字。
 * @returns 替换了占位符的完整缓存键。
 * @example getCacheKey({ KEY: 'user-info:{uid}', EXPIRE: 300 }, 123) => 'user-info:123'
 * @example getCacheKey({ KEY: 'user-info:{uid}:{email}', EXPIRE: 300 }, 123, 'a@b.com') => 'user-info:123:a@b.com'
 */
export const getCacheKey = (
  cache: { KEY: string; [key: string]: any }, // 使用简化类型或你原来的精确类型均可
  ...params: (string | number | null | undefined)[] // 进一步放宽类型，使其更健壮
): string => {
  // 使用 String() 进行安全的类型转换，避免因 null/undefined 报错。
  // 这会将 null 转换为 'null'，undefined 转换为 'undefined'。
  const stringParams = params.map((param) => String(param));

  // 从副本进行操作，不修改原始数组
  const paramsCopy = [...stringParams];

  return cache.KEY.replace(/{[^}]+}/g, () => {
    const replacement = paramsCopy.shift();
    if (replacement === undefined) {
      // 抛出明确的错误，告知调用者参数数量不足
      throw new Error('Not enough parameters provided for cache key.');
    }
    return replacement;
  });
};
