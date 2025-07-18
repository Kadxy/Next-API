import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, RequestWithUser } from './auth.guard';
import { AuthService } from './auth.service';
import { EmailBindDto, EmailLoginDto } from './dto/email-login.dto';
import { SendEmailLoginCodeDto } from './dto/send-email-login-code.dto';
import { JwtTokenService } from './jwt.service';
import {
  GetPublicUserInfoResponseDto,
  LoginResponseDto,
  UserResponseDto,
} from '../user/dto/user.dto';
import { UpdateDisplayNameDto } from './dto/update-display-name.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  @Post('/email/login/send-verification-code')
  @ApiOperation({ summary: 'Send Email Verification Code' })
  @ApiBody({ type: SendEmailLoginCodeDto })
  async sendEmailLoginCode(@Body() body: SendEmailLoginCodeDto): Promise<void> {
    return this.authService.sendEmailLoginCode(body);
  }

  @Post('/email/login/verify-code')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: EmailLoginDto })
  @ApiResponse({ type: LoginResponseDto })
  async login(@Body() loginDto: EmailLoginDto) {
    return this.authService.emailLogin(loginDto);
  }

  @Post('/email/bind/send-verify-code')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Send Email Bind Verification Code' })
  @ApiBody({ type: SendEmailLoginCodeDto })
  async sendEmailBindVerificationCode(
    @Req() req: RequestWithUser,
    @Body() body: SendEmailLoginCodeDto,
  ): Promise<void> {
    return this.authService.sendEmailBindVerifyEmail(req.user.id, body);
  }

  @Post('/email/bind/verify-code')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Bind Email' })
  @ApiBody({ type: EmailBindDto })
  @ApiResponse({ type: UserResponseDto })
  async bindEmail(@Req() req: RequestWithUser, @Body() body: EmailBindDto) {
    return this.authService.emailBind(req.user.id, body);
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
  @ApiResponse({ type: UserResponseDto })
  async account(@Req() req: RequestWithUser) {
    return this.authService.getSelf(req.user.uid);
  }

  @Put('/self/displayName')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update User Display Name' })
  @ApiBody({ type: UpdateDisplayNameDto })
  @ApiResponse({ type: UserResponseDto })
  async updateDisplayName(
    @Req() req: RequestWithUser,
    @Body() body: UpdateDisplayNameDto,
  ) {
    return this.authService.updateDisplayName(req.user.uid, body.displayName);
  }

  @Get('/public/:uid')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get User Public Info By Target User UID' })
  @ApiResponse({ type: GetPublicUserInfoResponseDto })
  async getPublicUserInfo(@Param('uid') uid: string) {
    return this.authService.getPublicUser(uid);
  }
}
