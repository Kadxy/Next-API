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
import { GitHubAuthDto } from './dto/github-auth.dto';

interface GitHubTokenResponse {
  /** Github Access Token(ghu_xxx) */
  access_token: string;

  /** Github Scope */
  scope: '' | string;

  /** Github Token Type */
  token_type: 'bearer' | string;

  /** Github Refresh Token(ghr_xxx) */
  refresh_token?: string;

  /** Github Expires In */
  expires_in?: number;
}

export interface GitHubUserResponse {
  /** Github User ID */
  id: number;

  /** Github Username(unique in github) */
  login: string;

  /** Github Avatar URL */
  avatar_url: string;

  /** Github Name */
  name: string | null;

  /** Github Email */
  email: string | null;
}

@Injectable()
export class GitHubAuthService {
  private readonly logger = new Logger(GitHubAuthService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly tokenUrl = 'https://github.com/login/oauth/access_token';
  private readonly userUrl = 'https://api.github.com/user';
  private readonly httpsAgent = new Agent();

  constructor(
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    this.clientId = this.configService.getOrThrow<string>('GITHUB_CLIENT_ID');
    this.clientSecret = this.configService.getOrThrow<string>(
      'GITHUB_CLIENT_SECRET',
    );
    this.redirectUri = this.configService.getOrThrow<string>(
      'GITHUB_REDIRECT_URI',
    );
  }

  // GitHub OAuth 登录 (code + state)
  async githubLogin(dto: GitHubAuthDto) {
    const { code, state } = dto;

    // 1. 检查 state 是否合法
    try {
      const cachedState = await this.cacheManager.get(
        getCacheKey(CACHE_KEYS.GITHUB_STATE, state),
      );
      if (!cachedState) {
        throw new BusinessException('Invalid state');
      }

      // 异步删除 state(不关心删除是否成功)
      this.cacheManager
        .del(getCacheKey(CACHE_KEYS.GITHUB_STATE, state))
        .catch();
    } catch (error) {
      throw new ErrorHandler(
        error,
        this.logger,
        'GitHub authentication failed',
      );
    }

    try {
      // 2. 使用 code 获取 access_token
      const { access_token } = await this.getGitHubAccessToken(code);

      // 3. 使用 access_token 获取用户信息
      const githubUser = await this.getGitHubUserInfo(access_token);
      const { id, login, name, email, avatar_url } = githubUser;
      const githubId = id.toString();
      if (!githubId) {
        throw new BusinessException('Missing required github id');
      }

      // 4. 检查用户是否已存在
      let user = await this.userService.getUserByGithubId(githubId);

      // 5. 用户不存在则创建新用户
      if (!user) {
        user = await this.userService.createUser({
          githubId,
          ...((login || name) && { displayName: login || name }),
          ...(email && { email }),
          ...(avatar_url && { avatar: avatar_url }),
        });
      }

      // 6. 生成JWT令牌
      const token = await this.jwtTokenService.sign(user);

      return { user, token };
    } catch (error) {
      throw new ErrorHandler(
        error,
        this.logger,
        'GitHub authentication failed',
      );
    }
  }

  // 获取 GitHub App/Client 配置信息
  async getGitHubConfig() {
    const clientId = this.clientId;
    const redirectUri = this.redirectUri;
    const state = Math.random().toString(36).substring(2, 15);

    await this.cacheManager.set(
      getCacheKey(CACHE_KEYS.GITHUB_STATE, state),
      state,
      CACHE_KEYS.GITHUB_STATE.EXPIRE,
    );

    const oauthUrl = new URL('https://github.com/login/oauth/authorize');
    oauthUrl.searchParams.set('client_id', clientId);
    oauthUrl.searchParams.set('redirect_uri', redirectUri);
    oauthUrl.searchParams.set('state', state);

    return { clientId, redirectUri, oauthUrl: oauthUrl.toString() };
  }

  // 获取 GitHub Access Token
  private async getGitHubAccessToken(
    code: string,
  ): Promise<GitHubTokenResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          this.tokenUrl,
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

  // 获取 GitHub User Info
  private async getGitHubUserInfo(
    accessToken: string,
  ): Promise<GitHubUserResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.userUrl, {
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
}
