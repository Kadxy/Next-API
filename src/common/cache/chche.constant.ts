export const CACHE_KEYS = {
  USER: {
    KEY: 'user:{uid}',
    EXPIRE: 60 * 60,
  },
} as const;

export const CACHE_FLAG = {
  EXIST: '1',
} as const;

/**
 * 获取缓存键
 * @param key 缓存键
 * @param param 参数
 * @returns 缓存键
 * @example getCacheKey(CACHE_KEYS.USER, '123') => 'user:123'
 */
export const getCacheKey = (
  key: keyof typeof CACHE_KEYS,
  param: string | number,
) => {
  return CACHE_KEYS[key].KEY.replace(/{[^}]+}/, String(param));
};
