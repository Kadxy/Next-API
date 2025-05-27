import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { BusinessException } from '../../../common/exceptions';
import { UserService } from '../../user/user.service';
import { JwtTokenService } from '../jwt.service';
import { Agent } from 'node:https';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_KEYS, getCacheKey } from 'src/core/cache/chche.constant';
import { Cache } from 'cache-manager';
import { GitHubAuthDto } from './dto/github-auth.dto';
import {
  GitHubTokenResponse,
  GitHubUserResponse,
} from './github-auth.interface';

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
  async login(dto: GitHubAuthDto) {
    const { code, state } = dto;

    const cacheKey = getCacheKey(CACHE_KEYS.GITHUB_STATE, state);

    // 1. 检查 state 是否合法
    const cachedState = await this.cacheManager.get(cacheKey);
    if (!cachedState) {
      throw new BusinessException('Invalid state');
    }

    // 1.1 异步删除 state(不关心删除是否成功)
    this.cacheManager.del(cacheKey).catch();

    // 2. 使用 code 获取 access_token
    const { access_token } = await this.getAccessToken(code);

    // 3. 使用 access_token 获取用户信息
    const githubUser = await this.getUserInfo(access_token);
    const { id, login, name, email, avatar_url } = githubUser;
    const gitHubId = id.toString();
    if (!gitHubId) {
      throw new BusinessException('Missing required github id');
    }

    // 4. 检查用户是否已存在
    let user = await this.userService.getUserByGitHubId(gitHubId);

    // 4.1 用户不存在则创建新用户
    if (!user) {
      user = await this.userService.createUser({
        gitHubId,
        ...((login || name) && { displayName: login || name }),
        ...(email && { email }),
        ...(avatar_url && { avatar: avatar_url }),
      });
    }

    // 5. 生成JWT令牌
    const token = await this.jwtTokenService.sign(user);

    return { user, token };
  }

  // 获取 GitHub App/Client 配置信息
  async getConfig() {
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
  private async getAccessToken(code: string): Promise<GitHubTokenResponse> {
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
  private async getUserInfo(accessToken: string): Promise<GitHubUserResponse> {
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
