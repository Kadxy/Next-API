import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GitHubAuthService } from './github-auth.service';
import { LoginResponseDto } from 'src/identity/user/dto/user.dto';
import { IOAuth2LoginDto } from '../oauth/oauth.interface';

@ApiTags('GitHub Authentication')
@Controller('auth/github')
export class GitHubAuthController {
  constructor(private readonly githubAuthService: GitHubAuthService) {}

  @Get('/config')
  @ApiOperation({ summary: 'Get GitHub OAuth Config' })
  getGithubConfig() {
    return this.githubAuthService.getConfig();
  }

  @Post('/login')
  @ApiOperation({ summary: 'GitHub OAuth Login' })
  @ApiBody({ type: IOAuth2LoginDto })
  @ApiResponse({ type: LoginResponseDto })
  async githubLogin(@Body() authDto: IOAuth2LoginDto) {
    return this.githubAuthService.loginOrRegister(authDto);
  }
}
