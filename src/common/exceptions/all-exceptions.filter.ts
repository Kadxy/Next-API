import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../interceptors/transform.interceptor';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(_exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(200).json({
      success: false,
      msg: 'Internal server error',
    } as ErrorResponse);
  }
}
