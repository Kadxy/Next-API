import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAuthService } from './google-auth.service';
import { LoginResponseDto, UserResponseDto } from 'src/identity/user/dto/user.dto';
import { IOAuth2LoginDto, OAuthActionType } from '../oauth/oauth.interface';
import { AuthGuard, RequestWithUser } from '../auth.guard';

@ApiTags('Google Authentication')
@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get('/config/:action')
  @ApiOperation({ summary: 'Get Google OAuth Config' })
  getGoogleConfig(@Param('action') action: OAuthActionType) {
    return this.googleAuthService.getConfig(action);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Google OAuth Login' })
  @ApiResponse({ type: LoginResponseDto })
  @ApiBody({ type: IOAuth2LoginDto })
  async googleLogin(@Body() authDto: IOAuth2LoginDto) {
    return this.googleAuthService.loginOrRegister(authDto);
  }

  @Post('/bind')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Google OAuth Bind' })
  @ApiResponse({ type: UserResponseDto })
  @ApiBody({ type: IOAuth2LoginDto })
  async googleBind(
    @Body() authDto: IOAuth2LoginDto,
    @Req() req: RequestWithUser,
  ) {
    return this.googleAuthService.bind(req.user.id, authDto);
  }
}
