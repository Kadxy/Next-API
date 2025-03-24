import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { GoogleAuthService } from './google-auth.service';
import { LoginResponseDto } from 'src/identity/user/dto/user.dto';

@ApiTags('Google Authentication')
@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Google OAuth Login' })
  @ApiBody({ type: GoogleAuthDto })
  @ApiResponse({ type: LoginResponseDto })
  async googleLogin(@Body() authDto: GoogleAuthDto) {
    return this.googleAuthService.login(authDto);
  }

  @Get('/config')
  @ApiOperation({ summary: 'Get Google OAuth Config' })
  getGoogleConfig() {
    return this.googleAuthService.getConfig();
  }
}
