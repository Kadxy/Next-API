const _getTTL = (counts: number, type: 's' | 'm' | 'h' | 'd') => {
  const seconds = { s: 1, m: 60, h: 3600, d: 86400 }[type];
  return counts * seconds;
};

export const CACHE_KEYS: Record<string, { KEY: string; EXPIRE: number }> = {
  USER_INFO: {
    KEY: 'user-info:{uid}',
    EXPIRE: _getTTL(3, 'h'),
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
 * @example getCacheKey(CACHE_KEYS.USER, '123') => 'user:123'
 */
export const getCacheKey = (
  cache: (typeof CACHE_KEYS)[string],
  param: string | number,
) => {
  return cache.KEY.replace(/{[^}]+}/, String(param));
};
