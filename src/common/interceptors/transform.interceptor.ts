import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalResponse, GlobalSuccessResponse } from '../exceptions';

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
