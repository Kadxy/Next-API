import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DEFAULT_ERROR_MSG, GlobalErrorResponse } from './index';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(_exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const resJson: GlobalErrorResponse = {
      success: false,
      msg: DEFAULT_ERROR_MSG,
    };

    response.status(HttpStatus.OK).json(resJson);
  }
}
