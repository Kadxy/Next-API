import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard, RequestWithUser } from './auth.guard';
import { AuthService } from './auth.service';
import { EmailLoginDto } from './dto/email-login.dto';
import { SendEmailLoginCodeDto } from './dto/send-email-login-code.dto';
import { JwtTokenService } from './jwt.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  @Post('/verification/email')
  @ApiOperation({ summary: 'Send Email Verification Code' })
  @ApiBody({ type: SendEmailLoginCodeDto })
  async sendEmailLoginCode(@Body() body: SendEmailLoginCodeDto): Promise<void> {
    return this.authService.sendEmailLoginCode(body);
  }

  @Post('/login/email')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: EmailLoginDto })
  async login(@Body() loginDto: EmailLoginDto) {
    return this.authService.emailLogin(loginDto);
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Logout Current Device' })
  async logout(@Req() req: RequestWithUser) {
    const authorization = req?.headers?.authorization;
    return this.authService.logout(this.jwtTokenService.extract(authorization));
  }

  @Post('/logout/all')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Logout All Devices' })
  async logoutAll(@Req() req: RequestWithUser) {
    return this.authService.logoutAll(req.user.uid);
  }

  @Get('/self')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get Current User' })
  async account(@Req() req: RequestWithUser) {
    return this.authService.getSelf(req.user.uid);
  }
}
