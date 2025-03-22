import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BusinessException } from './business.exception';
import { DEFAULT_ERROR_MSG, GlobalErrorResponse } from './index';

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 默认处理
    let status = HttpStatus.OK as HttpStatus;
    let msg = DEFAULT_ERROR_MSG;

    // 如果是业务异常，使用业务异常的状态码和消息
    if (exception instanceof BusinessException) {
      status = exception.statusCode;
      msg = exception.message;
    }

    response
      .status(status)
      .json({ success: false, msg } as GlobalErrorResponse);
  }
}
