import { HttpException, HttpStatus } from '@nestjs/common';
import { GlobalErrorResponse } from './index';

export class BusinessException extends HttpException {
  constructor(
    message: string = 'Internal server error',
    status: HttpStatus = HttpStatus.OK,
  ) {
    super({ success: false, msg: message } as GlobalErrorResponse, status);
  }
}

// 401 未授权
export class UnauthorizedException extends BusinessException {
  constructor(message: string = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

// 403 禁止访问
export class ForbiddenException extends BusinessException {
  constructor(message: string = 'Forbidden') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

// 429 请求过多
export class TooManyRequestsException extends BusinessException {
  constructor(message: string = 'Too Many Requests') {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
