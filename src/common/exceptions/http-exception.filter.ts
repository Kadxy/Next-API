import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from '@nestjs/common';
import { BusinessException } from './business.exception';
import { ErrorResponse } from '../interceptors/transform.interceptor';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 默认响应
    let status = HttpStatus.OK;
    let errorResponse: ErrorResponse = {
      success: false,
      msg: 'Internal server error',
    };

    // 如果是业务异常，覆盖默认的错误响应
    if (exception instanceof BusinessException) {
      status = exception.getStatus();
      errorResponse = exception.getResponse() as ErrorResponse;
    }

    response.status(status).json(errorResponse);
  }
}
