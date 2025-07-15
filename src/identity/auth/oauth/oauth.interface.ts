import { User } from '@prisma-mysql-client/client';
import { ApiProperty } from '@nestjs/swagger';
import { CACHE_KEYS } from '../../../core/cache/chche.constant';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export type OAuthActionType = 'login' | 'bind';

export const OAuthTypeEnum = {
  LOGIN: 'login',
  BIND: 'bind',
};

export class OAuthTypeParam {
  @ApiProperty({ description: 'OAuth type', example: 'login' })
  @IsString({ message: 'OAuth type必须是字符串' })
  @IsNotEmpty({ message: 'OAuth type不能为空' })
  @IsEnum(OAuthTypeEnum, { message: 'OAuth type必须是login或bind' })
  type: OAuthActionType;
}

/**
 * OAuth2通用登录DTO接口
 */
export abstract class IOAuth2LoginDto {
  @ApiProperty({ description: 'OAuth code', example: '1234567890' })
  @IsString({ message: '授权码必须是字符串' })
  @IsNotEmpty({ message: '授权码不能为空' })
  code: string;

  @ApiProperty({ description: 'OAuth state', example: '1234567890' })
  @IsString({ message: '授权状态必须是字符串' })
  @IsNotEmpty({ message: '授权状态不能为空' })
  state: string;
}

/**
 * OAuth2令牌响应通用接口
 */
export abstract class IOAuth2TokenResponse {
  @ApiProperty({ description: 'OAuth access_token', example: '1234567890' })
  access_token: string;

  @ApiProperty({ description: 'OAuth token_type', example: 'Bearer' })
  token_type: string;

  [key: string]: any;
}

/**
 * OAuth2用户信息通用接口
 */
export abstract class IOAuth2UserInfo {
  [key: string]: any;
}

/**
 * OAuth2配置响应接口
 */
export interface IOAuth2ConfigResponse {
  /** OAuth授权URL */
  oauthUrl: string;
}

/**
 * OAuth2登录响应接口
 */
export abstract class IOAuth2LoginResponse {
  @ApiProperty({ description: 'user info' })
  user: User;

  @ApiProperty({ description: 'jwt token' })
  token: string;
}

/**
 * OAuth2服务配置接口
 */
export abstract class IOAuth2ServiceConfig {
  /** 客户端ID配置键名 */
  clientIdKey: string;

  /** 客户端密钥配置键名 */
  clientSecretKey: string;

  /** 重定向URI */
  redirectUri: string;

  /** OAuth授权URL(即第三方登录页面) */
  authUrl: string;

  /** 获取令牌URL(即获取 access_token 的 URL) */
  tokenUrl: string;

  /** 获取用户信息URL */
  userInfoUrl: string;

  /** 缓存状态键前缀 */
  stateKeyPrefix: keyof typeof CACHE_KEYS;
}

/**
 * OAuth2服务抽象接口
 */
export interface IOAuth2Service {
  /**
   * 获取OAuth配置
   */
  getConfig(): Promise<IOAuth2ConfigResponse>;

  /**
   * OAuth登录
   */
  login(dto: IOAuth2LoginDto): Promise<IOAuth2LoginResponse>;
}
