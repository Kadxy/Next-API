/**
 * 生成随机显示名称
 * @param prefix{string} 前缀
 * @param suffixLength{number} 后缀长度
 * @param separator{string} 分隔符
 * @returns 显示名称 [prefix][separator][randomSuffix]
 * @example generateDisplayName('example', 4, '-') => example-1234
 */
export const generateDisplayName = (
  prefix: string,
  suffixLength: number,
  separator: string = '_',
) => {
  if (suffixLength <= 0 || suffixLength > 10) {
    throw new Error('suffixLength must be between 1 and 10');
  }

  const randomSuffix = Math.random()
    .toString(36)
    .substring(2, 2 + suffixLength);

  return [prefix, randomSuffix].join(separator);
};
