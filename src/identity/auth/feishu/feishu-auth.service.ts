import { Inject, Injectable } from '@nestjs/common';
import * as lark from '@larksuiteoapi/node-sdk';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { LimitedUser, UserService } from 'src/identity/user/user.service';
import { JwtTokenService } from '../jwt.service';
import { Cache } from 'cache-manager';
import { getCacheKey, CACHE_KEYS } from 'src/core/cache/chche.constant';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { BaseOAuth2Service } from '../oauth/oauth-base.service';
import {
  IOAuth2ConfigResponse,
  IOAuth2LoginDto,
  IOAuth2ServiceConfig,
  IOAuth2LoginResponse,
  OAuthActionType,
} from '../oauth/oauth.interface';
import { User } from '@prisma-main-client/client';

// https://open.feishu.cn/document/authentication-management/access-token/obtain-oauth-code

@Injectable()
export class FeishuAuthService extends BaseOAuth2Service {
  protected readonly config: IOAuth2ServiceConfig = {
    clientIdKey: 'FEISHU_APP_ID',
    clientSecretKey: 'FEISHU_APP_SECRET',
    redirectUri: 'http://localhost:5173/callback/feishu/{action}',
    authUrl: 'https://accounts.feishu.cn/open-apis/authen/v1/authorize',
    tokenUrl: 'https://open.feishu.cn/open-apis/authen/v1/access_token',
    userInfoUrl: 'https://open.feishu.cn/open-apis/authen/v1/user_info',
    stateKeyPrefix: 'FEISHU_STATE',
  };

  private client: lark.Client;

  public readonly scopes: string[] = [
    'contact:user.employee_id:readonly',
    'contact:user.base:readonly',
    'contact:user.email:readonly',
    'im:message:send_as_bot',
  ];

  constructor(
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super();
    this.loadConfig();
  }

  protected loadConfig(): void {
    const { clientIdKey, clientSecretKey } = this.config;
    this.clientId = this.configService.getOrThrow<string>(clientIdKey);
    this.clientSecret = this.configService.getOrThrow<string>(clientSecretKey);

    try {
      this.client = new lark.Client({
        appId: this.clientId,
        appSecret: this.clientSecret,
      });
    } catch (error) {
      this.logger.error('Failed to initialize Feishu Auth Service:', error);
      process.exit(1);
    }
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
    oauthUrl.searchParams.set('scope', this.scopes.join(' '));

    return { oauthUrl: oauthUrl.toString() };
  }

  async loginOrRegister(dto: IOAuth2LoginDto): Promise<IOAuth2LoginResponse> {
    const { code, state } = dto;

    // 1. 检查 state 是否合法
    await this.validateState(state);

    // 2. 使用 code 获取 access_token
    const { access_token } = await this.getAccessToken(code);

    // 3. 使用 access_token 获取用户信息
    const res = await this.getUserInfo(access_token);
    const { union_id, avatar_middle, email, name, en_name } = res.data;
    if (!union_id) {
      throw new BusinessException('Missing required feishu id');
    }

    // 4. 检查用户是否存在
    let user = await this.userService.getUserByFeishuId(union_id);

    const existEmailUser = email
      ? await this.userService.getUserByEmail(email)
      : null;

    // 4.1 用户不存在则创建新用户
    if (!user) {
      user = await this.userService.createUser({
        feishuId: union_id,
        ...(avatar_middle && { avatar: avatar_middle }),
        ...(email && !existEmailUser && { email }),
        ...((en_name || name) && { displayName: en_name || name }),
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
    const res = await this.getUserInfo(access_token);
    const { union_id } = res.data;
    if (!union_id) {
      throw new BusinessException('Missing required feishu id');
    }

    return this.userService.bindThirdPartyAccount(userId, 'feishuId', union_id);
  }

  // 获取 Feishu User Access Token
  protected async getAccessToken(code: string) {
    const res = await this.client.authen.v1.accessToken.create({
      data: { grant_type: 'authorization_code', code },
    });
    return res.data as any;
  }

  // 获取 Feishu User Info
  protected async getUserInfo(accessToken: string) {
    return await this.client.authen.v1.userInfo.get(
      {},
      lark.withUserAccessToken(accessToken),
    );
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
    // await new Promise((resolve) => setTimeout(resolve, 1000000));
    const { stateKeyPrefix } = this.config;
    const cacheKey = getCacheKey(CACHE_KEYS[stateKeyPrefix], state);
    const cachedState = await this.cacheManager.get(cacheKey);
    if (!cachedState) {
      throw new BusinessException('Invalid state');
    }

    this.cacheManager.del(cacheKey).catch();
  }
}
