export interface GitHubTokenResponse {
  /** GitHub Access Token(ghu_xxx) */
  access_token: string;

  /** GitHub Scope */
  scope: '' | string;

  /** GitHub Token Type */
  token_type: 'bearer' | string;

  /** GitHub Refresh Token(ghr_xxx) */
  refresh_token?: string;

  /** GitHub Expires In */
  expires_in?: number;
}

export interface GitHubUserResponse {
  /** GitHub User ID */
  id: number;

  /** GitHub Username(unique in github) */
  login: string;

  /** GitHub Avatar URL */
  avatar_url: string;

  /** GitHub Name */
  name: string | null;

  /** GitHub Email */
  email: string | null;
}
