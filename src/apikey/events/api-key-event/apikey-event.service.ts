import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ApiKeyEvents } from '../../../event-names';
import { ApikeyService } from 'src/apikey/apikey.service';

export class ApiKeyUsedEvent {
  constructor(
    public readonly hashKey: string,
    public readonly usedAt: Date,
    public readonly metadata: object,
  ) {}
}

@Injectable()
export class ApiKeyEventService {
  private readonly logger = new Logger(ApiKeyEventService.name);

  constructor(private readonly apikeyService: ApikeyService) {}

  @OnEvent(ApiKeyEvents.USED)
  async handleApiKeyUsedEvent(event: ApiKeyUsedEvent) {
    try {
      const { hashKey } = event;

      await this.apikeyService.updateLastUsedAt(hashKey);
    } catch (error) {
      this.logger.error(
        'Failed to update API key last used time',
        error.message,
        error.stack,
      );
    }
  }
}
