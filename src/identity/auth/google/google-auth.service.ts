import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { BusinessException, ErrorHandler } from '../../../common/exceptions';
import { UserService } from '../../user/user.service';
import { JwtTokenService } from '../jwt.service';
import { Agent } from 'node:https';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_KEYS, getCacheKey } from 'src/core/cache/chche.constant';
import { Cache } from 'cache-manager';
import { GoogleAuthDto } from './dto/google-auth.dto';

interface GoogleTokenResponse {
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

export interface GoogleUserResponse {
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

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly tokenUrl = 'https://oauth2.googleapis.com/token';
  private readonly userInfoUrl =
    'https://www.googleapis.com/oauth2/v2/userinfo';
  private readonly httpsAgent = new Agent();

  constructor(
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    this.clientId = this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID');
    this.clientSecret = this.configService.getOrThrow<string>(
      'GOOGLE_CLIENT_SECRET',
    );
    this.redirectUri = this.configService.getOrThrow<string>(
      'GOOGLE_REDIRECT_URI',
    );
  }

  // Google OAuth 登录 (code + state)
  async googleLogin(dto: GoogleAuthDto) {
    const { code, state } = dto;

    // 1. 检查 state 是否合法
    try {
      const cachedState = await this.cacheManager.get(
        getCacheKey(CACHE_KEYS.GOOGLE_STATE, state),
      );
      if (!cachedState) {
        throw new BusinessException('Invalid state');
      }

      // 异步删除 state(不关心删除是否成功)
      this.cacheManager
        .del(getCacheKey(CACHE_KEYS.GOOGLE_STATE, state))
        .catch();
    } catch (error) {
      throw new ErrorHandler(
        error,
        this.logger,
        'Google authentication failed',
      );
    }

    try {
      // 2. 使用 code 获取 access_token
      const { access_token } = await this.getGoogleAccessToken(code);

      // 3. 使用 access_token 获取用户信息
      const googleUser = await this.getGoogleUserInfo(access_token);
      this.logger.debug(googleUser);
      const {
        id,
        name,
        given_name,
        family_name,
        email,
        email_verified,
        picture,
      } = googleUser;
      const googleId = id;

      if (!googleId) {
        throw new BusinessException('Missing required google id');
      }

      // 4. 检查用户是否已存在
      let user = await this.userService.getUserByGoogleId(googleId);

      // 5. 用户不存在则创建新用户
      const displayName = name || `${given_name} ${family_name}`.trim();
      if (!user) {
        user = await this.userService.createUser({
          googleId,
          ...(displayName && { displayName }),
          ...(email && email_verified && { email }),
          ...(picture && { avatar: picture }),
        });
      }

      // 6. 生成JWT令牌
      const token = await this.jwtTokenService.sign(user);

      return { user, token };
    } catch (error) {
      throw new ErrorHandler(
        error,
        this.logger,
        'Google authentication failed',
      );
    }
  }

  // 获取 Google App/Client 配置信息
  async getGoogleConfig() {
    const clientId = this.clientId;
    const redirectUri = this.redirectUri;
    const state = Math.random().toString(36).substring(2, 15);

    await this.cacheManager.set(
      getCacheKey(CACHE_KEYS.GOOGLE_STATE, state),
      state,
      CACHE_KEYS.GOOGLE_STATE.EXPIRE,
    );

    const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    oauthUrl.searchParams.set('client_id', clientId);
    oauthUrl.searchParams.set('redirect_uri', redirectUri);
    oauthUrl.searchParams.set('response_type', 'code');
    oauthUrl.searchParams.set('state', state);
    oauthUrl.searchParams.set('scope', 'openid email profile');
    oauthUrl.searchParams.set('access_type', 'offline');
    oauthUrl.searchParams.set('prompt', 'consent');

    return { clientId, redirectUri, oauthUrl: oauthUrl.toString() };
  }

  // 获取 Google Access Token
  private async getGoogleAccessToken(
    code: string,
  ): Promise<GoogleTokenResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          this.tokenUrl,
          {
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.redirectUri,
            grant_type: 'authorization_code',
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            httpsAgent: this.httpsAgent,
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get Google access token: ${error?.message}`);
      throw error;
    }
  }

  // 获取 Google User Info
  private async getGoogleUserInfo(
    accessToken: string,
  ): Promise<GoogleUserResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.userInfoUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          httpsAgent: this.httpsAgent,
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to get Google user info: ${error?.message}`,
        error?.stack,
      );
      throw error;
    }
  }
}
