import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../../core/prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const canActivate = await super.canActivate(context);
    const googleUser = request.user.profile;

    if (googleUser) {
      const googleEmail = googleUser.emails?.[0]?.value;

      if (!googleEmail) {
        throw new BadRequestException('无法获取用户的电子邮件信息');
      }

      let user = await this.prisma.user.findFirst({
        where: {
          email: googleEmail,
        },
      });
      console.log('user', user);
      console.log('googleUser', googleUser);
      if (!user) {
        user = await this.userService.create({
          email: googleEmail,
          name: googleUser.displayName,
        });
      }

      request.user.dbUser = user;
    }

    return canActivate as boolean;
  }
}
