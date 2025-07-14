import { Logger } from '@nestjs/common';
import {
  IOAuth2LoginDto,
  IOAuth2ConfigResponse,
  IOAuth2LoginResponse,
  IOAuth2ServiceConfig,
  IOAuth2TokenResponse,
  IOAuth2UserInfo,
} from './oauth.interface';
import { Agent } from 'https';

export abstract class BaseOAuth2Service {
  protected logger = new Logger(this.constructor.name);
  protected clientId: string;
  protected clientSecret: string;
  protected readonly httpsAgent = new Agent();

  protected abstract readonly config: IOAuth2ServiceConfig;

  constructor() {}

  /**
   * 初始化OAuth配置
   */
  protected abstract loadConfig(): void;

  /**
   * 获取 OAuth2 配置
   */
  protected abstract getConfig(): Promise<IOAuth2ConfigResponse>;

  /**
   * 获取 access_token
   */
  protected abstract getAccessToken(
    code: string,
  ): Promise<IOAuth2TokenResponse>;

  /**
   * 获取用户信息
   */
  protected abstract getUserInfo(accessToken: string): Promise<IOAuth2UserInfo>;

  /**
   * 登录或注册
   */
  protected abstract loginOrRegister(
    dto: IOAuth2LoginDto,
  ): Promise<IOAuth2LoginResponse>;

  protected generateState(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * 生成并缓存 state
   */
  protected abstract generateAndCacheState(): Promise<string>;

  /**
   * 验证 state, 如果验证失败，则抛出异常
   */
  protected abstract validateState(state: string): Promise<void>;
}
