import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BusinessException } from './business.exception';
import { DEFAULT_ERROR_RESPONSE, GlobalErrorResponse } from './index';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 默认处理
    let status = HttpStatus.OK as HttpStatus;
    let errorResponse = { ...DEFAULT_ERROR_RESPONSE };

    // 如果是业务异常，使用业务异常的状态码和响应体
    if (exception instanceof BusinessException) {
      status = exception.getStatus();
      errorResponse = exception.getResponse() as GlobalErrorResponse;
    }

    response.status(status).json(errorResponse);
  }
}
