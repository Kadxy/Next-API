import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { GoogleAuthService } from './google-auth.service';

@ApiTags('Google Authentication')
@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Google OAuth Login' })
  @ApiBody({ type: GoogleAuthDto })
  async googleLogin(@Body() authDto: GoogleAuthDto) {
    return this.googleAuthService.login(authDto);
  }

  @Get('/config')
  @ApiOperation({ summary: 'Get Google OAuth Config' })
  getGoogleConfig() {
    return this.googleAuthService.getConfig();
  }
}
