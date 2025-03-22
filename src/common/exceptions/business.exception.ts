import { HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DEFAULT_ERROR_MSG } from './index';

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

/**
 * 用于处理错误的类，可以通过 throw new ErrorHandler(...) 使用
 */
export class ErrorHandler extends BusinessException {
  constructor(error: any, logger?: Logger, message?: string, ...args: any[]) {
    // 处理错误并决定使用哪种消息
    let errorMessage = DEFAULT_ERROR_MSG as string;
    let statusCode = HttpStatus.OK;

    // 如果是 BusinessException 类型的错误，使用其消息和状态码
    if (error instanceof BusinessException) {
      errorMessage = error.message;
      statusCode = error.statusCode;
    }

    // Prisma 错误处理
    else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': // 唯一约束冲突
          errorMessage = 'Record already exists';
          break;
        case 'P2025': // 记录未找到
          errorMessage = 'Record not found';
          break;
        default:
          logger?.error(
            'Prisma Error, code: %s, message: %s',
            error.code,
            error.message,
          );
      }
    }

    // 其他Prisma错误类型处理
    else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      logger?.error('Unknown prisma request error', error);
    }

    // 记录错误日志
    if (logger && message) {
      logger.error(message, ...args, error);
    }

    super(errorMessage, statusCode);
  }
}
