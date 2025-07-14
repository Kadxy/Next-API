import {
  IOAuth2TokenResponse,
  IOAuth2UserInfo,
} from '../oauth/oauth.interface';

export interface GoogleTokenResponse extends IOAuth2TokenResponse {
  /** Google Access Token */
  access_token: string;

  /** Google Token Type */
  token_type: 'Bearer' | string;

  /** Google ID Token */
  id_token: string;

  /** Google Expires In */
  expires_in: number;

  /** Google Refresh Token */
  refresh_token?: string;

  /** Google Scope */
  scope?: string;
}

export interface GoogleUserResponse extends IOAuth2UserInfo {
  /** Google User ID */
  id: string;

  /** Google Email */
  email: string;

  /** Google Email Verified */
  email_verified: boolean;

  /** Google Name */
  name: string;

  /** Google Given Name */
  given_name: string;

  /** Google Family Name */
  family_name: string;

  /** Google Picture URL */
  picture: string;
}
