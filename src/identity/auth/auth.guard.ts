import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
import { UnauthorizedException } from '../../common/exceptions';
import { JWT_ERR_MESSAGE, JwtTokenService } from './jwt.service';
import { JWT_TOKEN_NAME } from '../../main';

export interface RequestWithUser extends ExpressRequest {
  user: JwtPayload;
}

/** JWT 载荷 */
export interface JwtPayload {
  /** 用户UUID */
  uid: User['uid'];

  /** 令牌版本 */
  version: number;

  /** 令牌创建时间，由 JWT 库自动生成 */
  iat: number;

  /** 令牌过期时间，由 JWT 库自动生成 */
  exp: number;
}

/** 用于签发新令牌的载荷 */
export type JwtSignPayload = Omit<JwtPayload, 'iat' | 'exp'>;

@Injectable()
@ApiBearerAuth(JWT_TOKEN_NAME)
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    try {
      // 确保request和headers都存在
      if (!request || !request.headers) {
        throw new UnauthorizedException(JWT_ERR_MESSAGE.INVALID_TOKEN);
      }

      const { authorization } = request.headers;
      const token = this.jwtTokenService.extract(authorization);

      // 将 payload 附加到 request 对象中
      (request as RequestWithUser)['user'] =
        await this.jwtTokenService.verify(token);

      // 返回 true 表示验证通过
      return true;
    } catch (error) {
      throw error instanceof UnauthorizedException
        ? error
        : new UnauthorizedException(JWT_ERR_MESSAGE.INVALID_TOKEN);
    }
  }
}
