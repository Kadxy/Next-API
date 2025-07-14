import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAuthService } from './google-auth.service';
import { LoginResponseDto } from 'src/identity/user/dto/user.dto';
import { IOAuth2LoginDto } from '../oauth/oauth.interface';

@ApiTags('Google Authentication')
@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Google OAuth Login' })
  @ApiResponse({ type: LoginResponseDto })
  @ApiBody({ type: IOAuth2LoginDto })
  async googleLogin(@Body() authDto: IOAuth2LoginDto) {
    return this.googleAuthService.loginOrRegister(authDto);
  }

  @Get('/config')
  @ApiOperation({ summary: 'Get Google OAuth Config' })
  getGoogleConfig() {
    return this.googleAuthService.getConfig();
  }
}
