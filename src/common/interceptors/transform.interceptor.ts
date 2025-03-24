import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalResponse, GlobalSuccessResponse } from '../exceptions';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, GlobalResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<GlobalResponse<T>> {
    return next.handle().pipe(
      map(
        (data) =>
          ({
            success: true,
            data: data || null,
          }) as GlobalSuccessResponse<T>,
      ),
    );
  }
}

export class BaseResponse {
  @ApiProperty({ description: 'Operation Success', example: true })
  success: boolean;

  @ApiProperty({
    description: 'Error Message, only when success is false',
    example: 'You have no permission to access this resource',
  })
  msg?: string;
}

// 成功与失败响应的类型定义
export type SuccessResult<T> = {
  success: true;
  data: T;
  msg?: never;
};

export type ErrorResult = {
  success: false;
  msg: string;
  data?: never;
};

export type ApiResult<T> = SuccessResult<T> | ErrorResult;

// 工厂函数创建响应类
export function createResponseDto<T>(
  dataType: any,
  options?: ApiPropertyOptions,
) {
  class ResponseWithDataDto extends BaseResponse {
    @ApiProperty({
      description: 'Response data, only when success is true',
      type: dataType,
      ...options,
    })
    data?: T;
  }

  // 给类添加类型定义
  Object.defineProperty(ResponseWithDataDto, Symbol.hasInstance, {
    value: (instance: any): instance is ApiResult<T> => {
      return (
        instance &&
        ((instance.success === true && 'data' in instance) ||
          (instance.success === false && 'msg' in instance))
      );
    },
  });

  return ResponseWithDataDto;
}
