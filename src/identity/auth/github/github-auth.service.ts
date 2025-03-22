import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { BusinessException } from '../../../common/exceptions';
import { UserService } from '../../user/user.service';
import { JwtTokenService } from '../jwt.service';

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
  private readonly API_BASE_URL = 'https://api.github.com';
  private readonly logger = new Logger(GitHubAuthService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly tokenPath = 'login/oauth/access_token';
  private readonly userPath = 'user';

  constructor(
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.clientId = this.configService.getOrThrow<string>('GITHUB_CLIENT_ID');
    this.clientSecret = this.configService.getOrThrow<string>(
      'GITHUB_CLIENT_SECRET',
    );
    this.redirectUri = this.configService.getOrThrow<string>(
      'GITHUB_REDIRECT_URI',
    );
  }

  // GitHub OAuth登录流程
  async githubLogin(code: string) {
    try {
      // 1. 使用授权码获取访问令牌
      const tokenResponse = await this.getGitHubAccessToken(code);

      this.logger.debug(
        `GitHub token response: ${JSON.stringify(tokenResponse)}`,
      );

      // 2. 使用访问令牌获取用户信息
      const githubUser = await this.getGitHubUserInfo(
        tokenResponse.access_token,
      );

      // 3. 检查用户是否已存在
      let user = await this.userService.getUserByGithubId(
        githubUser.id.toString(),
      );

      // 4. 用户不存在则创建新用户
      if (!user) {
        user = await this.userService.createUser({
          githubId: githubUser.id.toString(),
          ...((githubUser.login || githubUser.name) && {
            displayName: githubUser.login || githubUser.name,
          }),
          ...(githubUser.email && { email: githubUser.email }),
          ...(githubUser.avatar_url && { avatar: githubUser.avatar_url }),
        });
      }

      // 5. 生成JWT令牌
      const token = await this.jwtTokenService.sign(user);

      return { user, token };
    } catch (error) {
      this.logger.error(`GitHub login error: ${error?.message}`, error?.stack);
      throw new BusinessException('GitHub authentication failed');
    }
  }

  // 获取GitHub配置信息
  getGitHubConfig() {
    const clientId = this.clientId;
    const redirectUri = this.redirectUri;

    const oauthUrl = new URL('https://github.com/login/oauth/authorize');
    oauthUrl.searchParams.set('client_id', clientId);
    oauthUrl.searchParams.set('redirect_uri', redirectUri);

    return { clientId, redirectUri, oauthUrl: oauthUrl.toString() };
  }

  // 获取GitHub访问令牌
  private async getGitHubAccessToken(
    code: string,
  ): Promise<GitHubTokenResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          [this.API_BASE_URL, this.tokenPath].join('/'),
          {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code,
          },
          {
            headers: {
              Accept: 'application/json',
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get GitHub access token: ${error?.message}`);
      throw new BusinessException('Failed to authenticate with GitHub');
    }
  }

  // 获取GitHub用户信息
  private async getGitHubUserInfo(
    accessToken: string,
  ): Promise<GitHubUserResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get([this.API_BASE_URL, this.userPath].join('/'), {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get GitHub user info: ${error?.message}`);
      throw new BusinessException('Failed to get user information from GitHub');
    }
  }
}
