import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GitHubAuthDto } from './dto/github-auth.dto';
import { GitHubAuthService } from './github-auth.service';

@ApiTags('GitHub Authentication')
@Controller('auth/github')
export class GitHubAuthController {
  constructor(private readonly githubAuthService: GitHubAuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'GitHub OAuth Login' })
  @ApiBody({ type: GitHubAuthDto })
  async githubLogin(@Body() authDto: GitHubAuthDto) {
    return this.githubAuthService.login(authDto);
  }

  @Get('/config')
  @ApiOperation({ summary: 'Get GitHub OAuth Config' })
  getGithubConfig() {
    return this.githubAuthService.getConfig();
  }
}
