import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApikeyService } from '../apikey.service';
import { UnauthorizedException } from 'src/common/exceptions';
import { ApiKey } from '@prisma-mysql-client/client';

export interface RequestWithApiKey extends FastifyRequest {
  apiKey: ApiKey;
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  constructor(private readonly apikeyService: ApikeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    try {
      // 从请求头中获取
      const apiKey = this.extractApiKey(request);

      // 验证并附加 APIKey 记录到请求对象
      request['apiKey'] = await this.apikeyService.verifyApiKey(apiKey);

      return true;
    } catch (error) {
      this.logger.error(`API key validation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * 从请求头中提取 API Key
   * @param request
   * @return API Key (sk-xxx)
   */
  private extractApiKey(request: FastifyRequest): string {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    throw new UnauthorizedException('API key is required');
  }
}
