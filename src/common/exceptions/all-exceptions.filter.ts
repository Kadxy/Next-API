import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { DEFAULT_ERROR_MSG, GlobalErrorResponse } from './index';
import { BusinessException } from './business.exception';
import { Prisma } from '@prisma/client';
import { Logger } from '@nestjs/common';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    // 默认错误响应
    let status = HttpStatus.OK;
    let message = DEFAULT_ERROR_MSG;

    switch (true) {
      case exception instanceof BusinessException:
        status = exception.statusCode;
        message = exception.message;
        break;

      case exception instanceof Prisma.PrismaClientKnownRequestError:
        switch (exception.code) {
          case 'P2002': // 唯一约束冲突
            message = 'Record already exists';
            break;
          case 'P2025': // 记录未找到
            message = 'Record not found';
            break;
          default:
            this.logger.error(
              `Prisma known request error,
              code: ${exception.code},
              message: ${exception.message},
              stack: ${exception.stack}`,
            );
        }
        break;

      case exception instanceof Prisma.PrismaClientUnknownRequestError:
        this.logger.error(
          `Prisma unknown request error,
          code: ${exception.name},
          message: ${exception.message},
          stack: ${exception.stack}`,
        );
        break;

      default:
        this.logger.error(`Unknown error, error: ${exception}`);
    }

    const responseJson: GlobalErrorResponse = { success: false, msg: message };

    response.status(status).send(responseJson);
  }
}
