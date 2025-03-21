import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiKeyAuthGuard } from '../guards/api-key-auth.guard';

export function ApiKeyAuth() {
  return applyDecorators(UseGuards(ApiKeyAuthGuard));
}
