/**
 * API密钥相关事件名称常量
 *
 * 使用常量而非字符串可以提高代码的可维护性，
 * 避免因拼写错误导致的问题，并提供自动完成支持
 */
export const ApiKeyEvents = {
  /**
   * API密钥使用事件
   * 当API密钥被用于验证请求时触发
   */
  USED: 'apikey.used',
};
