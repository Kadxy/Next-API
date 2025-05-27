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
import { GoogleAuthDto } from './dto/google-auth.dto';
import {
  GoogleTokenResponse,
  GoogleUserResponse,
} from './google-auth.interface';

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
  async login(dto: GoogleAuthDto) {
    const { code, state } = dto;
    const cacheKey = getCacheKey(CACHE_KEYS.GOOGLE_STATE, state);

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
    const googleUser = await this.getUserInfo(access_token);
    const {
      id,
      email,
      email_verified,
      picture,
      name,
      given_name,
      family_name,
    } = googleUser;
    const googleId = id;

    if (!googleId) {
      throw new BusinessException('Missing required google id');
    }

    // 4. 检查用户是否已存在
    let user = await this.userService.getUserByGoogleId(googleId);

    // 4.1 用户不存在则创建新用户
    const displayName = name || `${given_name} ${family_name}`.trim();
    if (!user) {
      user = await this.userService.createUser({
        googleId,
        ...(displayName && { displayName }),
        ...(email && email_verified && { email }),
        ...(picture && { avatar: picture }),
      });
    }

    // 5. 生成JWT令牌
    const token = await this.jwtTokenService.sign(user);

    return { user, token };
  }

  // 获取 Google App/Client 配置信息
  async getConfig() {
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
  private async getAccessToken(code: string): Promise<GoogleTokenResponse> {
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
  private async getUserInfo(accessToken: string): Promise<GoogleUserResponse> {
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
