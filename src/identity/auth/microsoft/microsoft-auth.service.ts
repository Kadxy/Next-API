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
  MicrosoftTokenResponse,
  MicrosoftUserResponse,
} from './microsoft-auth.interface';
import {
  IOAuth2ConfigResponse,
  IOAuth2LoginDto,
  IOAuth2ServiceConfig,
  OAuthActionType,
} from '../oauth/oauth.interface';
import { BaseOAuth2Service } from '../oauth/oauth-base.service';
import { CACHE_KEYS, getCacheKey } from 'src/core/cache/chche.constant';
import { User } from '@prisma-main-client/client';

@Injectable()
export class MicrosoftAuthService extends BaseOAuth2Service {
  protected readonly config: IOAuth2ServiceConfig = {
    clientIdKey: 'MICROSOFT_CLIENT_ID',
    clientSecretKey: 'MICROSOFT_CLIENT_SECRET',
    redirectUri: 'http://localhost:5173/callback/microsoft/{action}',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
    stateKeyPrefix: 'MICROSOFT_STATE',
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
    oauthUrl.searchParams.set('scope', 'openid email profile User.Read');
    oauthUrl.searchParams.set('response_mode', 'query');

    this.logger.debug({ oauthUrl: oauthUrl.toString() });
    return { oauthUrl: oauthUrl.toString() };
  }

  async getAccessToken(
    code: string,
    action: OAuthActionType = 'login',
  ): Promise<MicrosoftTokenResponse> {
    const { tokenUrl, redirectUri } = this.config;

    try {
      const params: Record<string, string> = {
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: redirectUri.replace('{action}', action),
        grant_type: 'authorization_code',
      };

      const response = await firstValueFrom(
        this.httpService.post(tokenUrl, new URLSearchParams(params), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          httpsAgent: this.httpsAgent,
        }),
      );

      return response.data;
    } catch (error) {
      const errorResponse = error.response?.data;
      this.logger.error(
        `Failed to get Microsoft access token. Status: ${error.response?.status}, Data: ${JSON.stringify(errorResponse)}`,
      );
      throw error;
    }
  }

  async getUserInfo(accessToken: string): Promise<MicrosoftUserResponse> {
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
        `Failed to get Microsoft user info: ${error?.message}`,
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
    const microsoftUser = await this.getUserInfo(access_token);
    const {
      id: microsoftId,
      mail,
      displayName,
      givenName,
      surname,
    } = microsoftUser;

    if (!microsoftId) {
      throw new BusinessException('Missing required microsoft id');
    }

    // 4. 检查用户是否已存在
    let user = await this.userService.getUserByMicrosoftId(microsoftId);

    const existEmailUser = mail
      ? await this.userService.getUserByEmail(mail)
      : null;

    // 4.1 用户不存在则创建新用户
    const userName = displayName || `${givenName} ${surname}`.trim();
    if (!user) {
      user = await this.userService.createUser({
        microsoftId,
        ...(userName && { displayName: userName }),
        ...(mail && !existEmailUser && { email: mail }),
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
    const microsoftUser = await this.getUserInfo(access_token);
    const { id: microsoftId } = microsoftUser;

    if (!microsoftId) {
      throw new BusinessException('Missing required microsoft id');
    }

    return this.userService.bindThirdPartyAccount(
      userId,
      'microsoftId',
      microsoftId,
    );
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
