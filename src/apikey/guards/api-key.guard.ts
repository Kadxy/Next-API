import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApikeyService } from '../apikey.service';
import { ApiKey } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiKeyEvents } from '../../event-names';
import { ApiKeyUsedEvent } from '../events/api-key-event/apikey-event.service';
import { UnauthorizedException } from 'src/common/exceptions';

export interface RequestWithApiKey extends FastifyRequest {
  apiKey: ApiKey;
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  constructor(
    private readonly apikeyService: ApikeyService,
    private eventEmitter: EventEmitter2,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    try {
      // 从请求头中获取
      const apiKey = this.extractApiKey(request);

      // 验证
      const apiKeyRecord = await this.apikeyService.verifyApiKey(apiKey);

      // 附加 APIKEY 记录到请求对象
      request['apiKey'] = apiKeyRecord;

      // 发布API密钥使用事件
      this.eventEmitter.emit(
        ApiKeyEvents.USED,
        new ApiKeyUsedEvent(apiKeyRecord.hashKey, new Date(), {}),
      );

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
