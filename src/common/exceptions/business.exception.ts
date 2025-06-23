import { HttpStatus } from '@nestjs/common';
import { DEFAULT_ERROR_MSG } from './index';
import { ULID } from 'ulid';

export class BusinessException extends Error {
  constructor(
    public readonly message: string = DEFAULT_ERROR_MSG,
    public readonly statusCode: HttpStatus = HttpStatus.OK,
  ) {
    super(message);
  }
}

// 401 Unauthorized
export class UnauthorizedException extends BusinessException {
  constructor(message: string = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

// 403 Forbidden
export class ForbiddenException extends BusinessException {
  constructor(message: string = 'Insufficient balance') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

// 429 Too Many Requests
export class TooManyRequestsException extends BusinessException {
  constructor(message: string = 'Too many requests, please try again later') {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}

// 500 Internal Server Error - 调用上游API失败
export class APICallException extends BusinessException {
  constructor(requestId: ULID, message: string = 'API call failed') {
    const errorMessage = `${message}(RequestId:${requestId})`;

    super(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
