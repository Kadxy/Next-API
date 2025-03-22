import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { DEFAULT_ERROR_MSG, GlobalErrorResponse } from './index';
import { BusinessException } from './business.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    // 默认错误响应
    let status = HttpStatus.OK;
    let message = DEFAULT_ERROR_MSG;

    // 如果是业务异常，使用业务异常的状态码和消息
    if (exception instanceof BusinessException) {
      status = exception.statusCode;
      message = exception.message;
    }

    const resJson: GlobalErrorResponse = {
      success: false,
      msg: message,
    };

    response.status(status).send(resJson);
  }
}
