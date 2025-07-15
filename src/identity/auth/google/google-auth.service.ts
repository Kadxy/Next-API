import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { BusinessException } from '../../../common/exceptions';
import { LimitedUser, UserService } from '../../user/user.service';
import { JwtTokenService } from '../jwt.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  GoogleTokenResponse,
  GoogleUserResponse,
} from './google-auth.interface';
import {
  IOAuth2ConfigResponse,
  IOAuth2LoginDto,
  IOAuth2ServiceConfig,
  OAuthActionType,
} from '../oauth/oauth.interface';
import { BaseOAuth2Service } from '../oauth/oauth-base.service';
import { CACHE_KEYS, getCacheKey } from 'src/core/cache/chche.constant';
import { User } from '@prisma-mysql-client/client';

@Injectable()
export class GoogleAuthService extends BaseOAuth2Service {
  protected readonly config: IOAuth2ServiceConfig = {
    clientIdKey: 'GOOGLE_CLIENT_ID',
    clientSecretKey: 'GOOGLE_CLIENT_SECRET',
    redirectUri: 'http://localhost:5173/callback/google/{action}',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    stateKeyPrefix: 'GOOGLE_STATE',
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super();
    this.loadConfig();
  }

  loadConfig(): void {
    const { clientIdKey, clientSecretKey } = this.config;
    this.clientId = this.configService.getOrThrow<string>(clientIdKey);
    this.clientSecret = this.configService.getOrThrow<string>(clientSecretKey);
  }

  async getConfig(action: OAuthActionType): Promise<IOAuth2ConfigResponse> {
    const clientId = this.clientId;
    const { authUrl, redirectUri } = this.config;

    const state = await this.generateAndCacheState();

    const oauthUrl = new URL(authUrl);
    oauthUrl.searchParams.set('client_id', clientId);
    oauthUrl.searchParams.set(
      'redirect_uri',
      redirectUri.replace('{action}', action),
    );
    oauthUrl.searchParams.set('response_type', 'code');
    oauthUrl.searchParams.set('state', state);
    oauthUrl.searchParams.set('scope', 'openid email profile');
    oauthUrl.searchParams.set('access_type', 'offline');
    oauthUrl.searchParams.set('prompt', 'consent');

    this.logger.debug({ oauthUrl: oauthUrl.toString() });
    return { oauthUrl: oauthUrl.toString() };
  }

  async getAccessToken(
    code: string,
    action: OAuthActionType,
  ): Promise<GoogleTokenResponse> {
    const { tokenUrl, redirectUri } = this.config;
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          tokenUrl,
          {
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: redirectUri.replace('{action}', action),
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
      // 关键：打印出 Google 返回的具体错误信息
      const errorResponse = error.response?.data;
      this.logger.error(
        `Failed to get Google access token. Status: ${error.response?.status}, Data: ${JSON.stringify(errorResponse)}`,
      );
      // this.logger.error('Full error object:', error); // 也可以打印完整错误对象以供调试
      throw error;
    }
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserResponse> {
    const { userInfoUrl } = this.config;

    try {
      const response = await firstValueFrom(
        this.httpService.get(userInfoUrl, {
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

  async loginOrRegister(dto: IOAuth2LoginDto) {
    const { code, state } = dto;

    // 1. 检查 state 是否合法
    await this.validateState(state);

    // 2. 使用 code 获取 access_token
    const { access_token } = await this.getAccessToken(code, 'login');

    // 3. 使用 access_token 获取用户信息
    const googleUser = await this.getUserInfo(access_token);
    const {
      id: googleId,
      email,
      email_verified,
      picture,
      name,
      given_name,
      family_name,
    } = googleUser;

    if (!googleId) {
      throw new BusinessException('Missing required google id');
    }

    // 4. 检查用户是否已存在
    let user = await this.userService.getUserByGoogleId(googleId);

    const existEmailUser = email
      ? await this.userService.getUserByEmail(email)
      : null;

    // 4.1 用户不存在则创建新用户
    const displayName = name || `${given_name} ${family_name}`.trim();
    if (!user) {
      user = await this.userService.createUser({
        googleId,
        ...(displayName && { displayName }),
        ...(email && email_verified && !existEmailUser && { email }),
        ...(picture && { avatar: picture }),
      });
    }

    // 5. 生成JWT令牌
    const token = await this.jwtTokenService.sign(user);

    return { user, token };
  }

  async bind(userId: User['id'], dto: IOAuth2LoginDto): Promise<LimitedUser> {
    const { code, state } = dto;

    // 1. 检查 state 是否合法
    await this.validateState(state);

    // 2. 使用 code 获取 access_token
    const { access_token } = await this.getAccessToken(code, 'bind');

    // 3. 使用 access_token 获取用户信息
    const googleUser = await this.getUserInfo(access_token);
    const { id: googleId } = googleUser;

    if (!googleId) {
      throw new BusinessException('Missing required google id');
    }

    return this.userService.bindThirdPartyAccount(userId, 'googleId', googleId);
  }

  async generateAndCacheState(): Promise<string> {
    const { stateKeyPrefix } = this.config;

    const state = this.generateState();
    const cacheKey = getCacheKey(CACHE_KEYS[stateKeyPrefix], state);
    await this.cacheManager.set(
      cacheKey,
      state,
      CACHE_KEYS[stateKeyPrefix].EXPIRE,
    );
    return state;
  }

  async validateState(state: string): Promise<void> {
    const cacheKey = getCacheKey(CACHE_KEYS[this.config.stateKeyPrefix], state);
    const cachedState = await this.cacheManager.get(cacheKey);
    if (!cachedState) {
      throw new BusinessException('Invalid state');
    }
    // 异步删除state，防止重复使用
    this.cacheManager.del(cacheKey).catch();
  }
}
