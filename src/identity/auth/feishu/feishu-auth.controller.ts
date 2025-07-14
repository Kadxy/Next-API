import { Body, Controller, Get, Post } from '@nestjs/common';
import { FeishuAuthService } from './feishu-auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from 'src/identity/user/dto/user.dto';
import { IOAuth2LoginDto } from '../oauth/oauth.interface';

@ApiTags('Feishu Authentication')
@Controller('auth/feishu')
export class FeishuAuthController {
  constructor(private readonly feishuAuthService: FeishuAuthService) {}

  @Get('/config')
  @ApiOperation({ summary: 'Get Feishu OAuth Config' })
  getFeishuConfig() {
    return this.feishuAuthService.getConfig();
  }

  @Post('/login')
  @ApiOperation({ summary: 'Feishu OAuth Login' })
  @ApiBody({ type: IOAuth2LoginDto })
  @ApiResponse({ type: LoginResponseDto })
  async feishuLogin(@Body() authDto: IOAuth2LoginDto) {
    return this.feishuAuthService.loginOrRegister(authDto);
  }
}
