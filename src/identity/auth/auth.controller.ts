import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, RequestWithUser } from './auth.guard';
import { AuthService } from './auth.service';
import {
  EmailLoginDto,
  LoginResponseDto,
  SelfResponseDto,
} from './dto/email-login.dto';
import { SendEmailCodeDto } from './dto/send-email-code.dto';
import { JwtTokenService } from './jwt.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  @ApiOperation({ summary: 'Send Email Verification Code' })
  @Post('/verification/email')
  async sendEmailLoginCode(@Body() body: SendEmailCodeDto): Promise<void> {
    return this.authService.sendEmailLoginCode(body);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ type: LoginResponseDto })
  @Post('/login/email')
  async login(@Body() loginDto: EmailLoginDto) {
    return this.authService.emailLogin(loginDto);
  }

  @ApiOperation({ summary: 'Logout Current Device' })
  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(@Req() req: RequestWithUser) {
    const authorization = req?.headers?.authorization;
    return this.authService.logout(this.jwtTokenService.extract(authorization));
  }

  @ApiOperation({ summary: 'Logout All Devices' })
  @UseGuards(AuthGuard)
  @Post('/logout/all')
  async logoutAll(@Req() req: RequestWithUser) {
    return this.authService.logoutAll(req.user.uid);
  }

  @ApiOperation({ summary: 'Get Current User' })
  @ApiResponse({ type: SelfResponseDto })
  @UseGuards(AuthGuard)
  @Get('/self')
  async account(@Req() req: RequestWithUser) {
    return this.authService.getSelf(req.user.uid);
  }
}
