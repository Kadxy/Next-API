import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { BusinessException } from '../../../common/exceptions';
import { LimitedUser, UserService } from '../../user/user.service';
import { JwtTokenService } from '../jwt.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_KEYS, getCacheKey } from 'src/core/cache/chche.constant';
import { Cache } from 'cache-manager';
import {
  GitHubTokenResponse,
  GitHubUserResponse,
} from './github-auth.interface';
import { BaseOAuth2Service } from '../oauth/oauth-base.service';
import {
  IOAuth2ConfigResponse,
  IOAuth2ServiceConfig,
  IOAuth2LoginDto,
  OAuthActionType,
} from '../oauth/oauth.interface';
import { User } from '@prisma-mysql-client/client';

@Injectable()
export class GitHubAuthService extends BaseOAuth2Service {
  protected readonly config: IOAuth2ServiceConfig = {
    clientIdKey: 'GITHUB_CLIENT_ID',
    clientSecretKey: 'GITHUB_CLIENT_SECRET',
    redirectUri: 'http://localhost:5173/callback/github/{action}',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    stateKeyPrefix: 'GITHUB_STATE',
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
    oauthUrl.searchParams.set('state', state);

    return { oauthUrl: oauthUrl.toString() };
  }

  async loginOrRegister(dto: IOAuth2LoginDto) {
    const { code, state } = dto;

    // 1. 检查 state 是否合法
    await this.validateState(state);

    // 2. 使用 code 获取 access_token
    const { access_token } = await this.getAccessToken(code);

    // 3. 使用 access_token 获取用户信息
    const githubUser = await this.getUserInfo(access_token);
    const { id: gitHubId, login, name, email, avatar_url } = githubUser;
    if (!gitHubId) {
      throw new BusinessException('Missing required github id');
    }

    // 4. 检查用户是否已存在
    let user = await this.userService.getUserByGitHubId(gitHubId.toString());

    const existEmailUser = email
      ? await this.userService.getUserByEmail(email)
      : null;

    // 4.1 用户不存在则创建新用户
    if (!user) {
      user = await this.userService.createUser({
        gitHubId: gitHubId.toString(),
        ...((login || name) && { displayName: login || name }),
        ...(email && !existEmailUser && { email }),
        ...(avatar_url && { avatar: avatar_url }),
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
    const { access_token } = await this.getAccessToken(code);

    // 3. 使用 access_token 获取用户信息
    const githubUser = await this.getUserInfo(access_token);
    const { id: gitHubId } = githubUser;
    if (!gitHubId) {
      throw new BusinessException('Missing required github id');
    }

    return await this.userService.bindOAuthAccount(
      userId,
      'gitHubId',
      gitHubId.toString(),
    );
  }

  protected async getAccessToken(code: string): Promise<GitHubTokenResponse> {
    const { tokenUrl } = this.config;

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          tokenUrl,
          {
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
          },
          {
            headers: {
              Accept: 'application/json',
            },
            httpsAgent: this.httpsAgent,
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get GitHub access token: ${error?.message}`);
      throw error;
    }
  }

  protected async getUserInfo(
    accessToken: string,
  ): Promise<GitHubUserResponse> {
    const { userInfoUrl } = this.config;

    try {
      const response = await firstValueFrom(
        this.httpService.get(userInfoUrl, {
          headers: {
            Authorization: `token ${accessToken}`,
          },
          httpsAgent: this.httpsAgent,
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to get GitHub user info: ${error?.message}`,
        error?.stack,
      );
      throw error;
    }
  }

  protected async generateAndCacheState(): Promise<string> {
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

  protected async validateState(state: string): Promise<void> {
    const cacheKey = getCacheKey(CACHE_KEYS[this.config.stateKeyPrefix], state);
    const cachedState = await this.cacheManager.get(cacheKey);
    if (!cachedState) {
      throw new BusinessException('Invalid state parameter');
    }
    this.cacheManager.del(cacheKey).catch();
  }
}
