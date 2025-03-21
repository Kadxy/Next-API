import { Controller, Get, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../auth/decorators/public.decorator';
import { BusinessException } from '../common/exceptions/business.exception';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('test-success')
  testSuccess() {
    return { message: '这是一个成功的测试响应' };
  }

  @Public()
  @Get('test-error')
  testError() {
    throw new BusinessException('这是一个业务异常测试');
  }

  @Public()
  @Get('test-not-found')
  testNotFound() {
    throw new NotFoundException('资源未找到测试');
  }
}
