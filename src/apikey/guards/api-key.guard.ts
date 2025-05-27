import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApikeyService } from '../apikey.service';
import { UnauthorizedException } from 'src/common/exceptions';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  constructor(private readonly apikeyService: ApikeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    try {
      // 从请求头中获取
      const apiKey = this.extractApiKey(request);

      // 验证
      const apiKeyRecord = await this.apikeyService.verifyApiKey(apiKey);

      // 附加 APIKEY 记录到请求对象
      request['apiKey'] = apiKeyRecord;

      return true;
    } catch (error) {
      this.logger.error(`API key validation failed: ${error.message}`);
      throw error;
    }
  }

  private extractApiKey(request: FastifyRequest): string {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    throw new UnauthorizedException('API key is required');
  }
}
