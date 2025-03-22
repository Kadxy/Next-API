import { PostContent } from './feishu-webhook.interface';

/**
 * Get the error message
 * - If the error is an instance of Error, return the error message
 * - Otherwise, return the error message as a string limited to 128 characters
 * @param error - The error object
 * @returns The error message
 */
const getErrorMessage = (error: any) => {
  return error instanceof Error ? error.message : String(error).slice(0, 128);
};

export const getTencentSESErrorMessage = (
  email: string,
  error: any,
): PostContent => {
  return {
    title: '🚨 Tencent SES Error',
    content: [
      [{ tag: 'text', text: `Email: ${email}` }],
      [{ tag: 'text', text: `Error: ${getErrorMessage(error)}` }],
    ],
  };
};
