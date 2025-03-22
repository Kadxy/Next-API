import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { UnauthorizedException } from '../../common/exceptions';
import { JWT_ERR_MESSAGE, JwtTokenService } from './jwt.service';
import { JWT_TOKEN_NAME } from '../../main';

export interface RequestWithUser extends FastifyRequest {
  user: User;
}

/** JWT 载荷 */
export interface JwtPayload {
  /** 用户ID */
  uid: string;

  /** 令牌过期时间，Unix timestamp */
  exp: number;

  /** 令牌签发时间，Unix timestamp */
  iat: number;

  /** 令牌版本，用于判断是否需要刷新 */
  version?: number;
}

/** 用于签发新令牌的载荷 */
export type JwtSignPayload = Omit<JwtPayload, 'iat' | 'exp'>;

@Injectable()
@ApiBearerAuth(JWT_TOKEN_NAME)
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    try {
      // 确保request和headers都存在
      if (!request || !request.headers) {
        throw new UnauthorizedException(JWT_ERR_MESSAGE.INVALID_TOKEN);
      }

      const { authorization } = request.headers;
      const token = this.jwtTokenService.extract(authorization as string);

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
