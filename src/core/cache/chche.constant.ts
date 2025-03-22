const _getTTL = (counts: number, type: 's' | 'm' | 'h' | 'd') => {
  const seconds = { s: 1, m: 60, h: 3600, d: 86400 }[type];
  return counts * seconds;
};

export const DEFAULT_CACHE_TTL = _getTTL(1, 'h');

export const CACHE_KEYS = {
  USER_INFO_UID: {
    KEY: 'user-info:{uid}',
    EXPIRE: _getTTL(3, 'h'),
  },
  EMAIL_LIMIT: {
    KEY: 'email-limit:{email}',
    EXPIRE: _getTTL(1, 'm'),
  },
  LOGIN_EMAIL_CODE: {
    KEY: 'login-email-code:{email}',
    EXPIRE: _getTTL(10, 'm'),
  },
  JWT_VERSION: {
    KEY: 'jwt-version:{uid}',
    EXPIRE: _getTTL(1, 'd'),
  },
  JWT_BLACKLIST: {
    KEY: 'jwt-blacklist:{token}',
    EXPIRE: _getTTL(1, 'd'),
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
