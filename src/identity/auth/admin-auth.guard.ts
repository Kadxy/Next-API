import { ExecutionContext, Injectable } from '@nestjs/common';
import { ForbiddenException } from 'src/common/exceptions';
import { AuthGuard } from './auth.guard';

@Injectable()
export class AdminAuthGuard extends AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activated = await super.canActivate(context);
    if (!activated) {
      return false;
    }

    // const request = context.switchToHttp().getRequest<RequestWithUser>();

    // 暂时不允许任何请求
    throw new ForbiddenException('Admin only');

    // return true;
  }
}
