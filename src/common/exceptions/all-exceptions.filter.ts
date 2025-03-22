import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DEFAULT_ERROR_RESPONSE } from './index';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(_exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.OK).json(DEFAULT_ERROR_RESPONSE);
  }
}
