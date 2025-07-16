import {
  IOAuth2TokenResponse,
  IOAuth2UserInfo,
} from '../oauth/oauth.interface';

export interface MicrosoftTokenResponse extends IOAuth2TokenResponse {
  /** Microsoft Access Token */
  access_token: string;

  /** Microsoft Token Type */
  token_type: 'Bearer' | string;

  /** Microsoft ID Token */
  id_token?: string;

  /** Microsoft Expires In */
  expires_in: number;

  /** Microsoft Refresh Token */
  refresh_token?: string;

  /** Microsoft Scope */
  scope?: string;
}

export interface MicrosoftUserResponse extends IOAuth2UserInfo {
  /** Microsoft User ID */
  id: string;

  /** Microsoft User Principal Name (UPN) */
  userPrincipalName: string;

  /** Microsoft Display Name */
  displayName: string;

  /** Microsoft Given Name */
  givenName: string;

  /** Microsoft Surname */
  surname: string;

  /** Microsoft Mail */
  mail: string;

  /** Microsoft Mobile Phone */
  mobilePhone: string;

  /** Microsoft Job Title */
  jobTitle: string;

  /** Microsoft Office Location */
  officeLocation: string;

  /** Microsoft Preferred Language */
  preferredLanguage: string;
}
