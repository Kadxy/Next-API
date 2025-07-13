// https://docs.nestjs.com/techniques/caching#interacting-with-the-cache-store

import { minutes, days } from '@nestjs/throttler';

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
    EXPIRE: minutes(1),
  },
} as const;

export const CACHE_FLAG = {
  EXIST: '1',
} as const;

/**
 * 获取缓存键
 * @param cache 缓存信息
 * @param param 参数
 * @returns 缓存键
 * @example getCacheKey(CACHE_KEYS.USER_INFO, '123') => 'user-info:123'
 */
export const getCacheKey = (
  cache: (typeof CACHE_KEYS)[keyof typeof CACHE_KEYS],
  param: string | number,
) => {
  return cache.KEY.replace(/{[^}]+}/, String(param));
};
