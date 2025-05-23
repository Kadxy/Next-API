import { ExecutionContext, Injectable } from '@nestjs/common';
import { ForbiddenException } from 'src/common/exceptions';
import { AuthGuard, RequestWithUser } from './auth.guard';

@Injectable()
export class AdminAuthGuard extends AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activated = await super.canActivate(context);
    if (!activated) {
      return false;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user?.isAdmin) {
      throw new ForbiddenException('Admin only');
    }

    return true;
  }
}
