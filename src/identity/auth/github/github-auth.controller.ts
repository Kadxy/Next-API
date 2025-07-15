import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GitHubAuthService } from './github-auth.service';
import { LoginResponseDto, UserResponseDto } from 'src/identity/user/dto/user.dto';
import { IOAuth2LoginDto, OAuthActionType } from '../oauth/oauth.interface';
import { AuthGuard, RequestWithUser } from '../auth.guard';

@ApiTags('GitHub Authentication')
@Controller('auth/github')
export class GitHubAuthController {
  constructor(private readonly githubAuthService: GitHubAuthService) {}

  @Get('/config/:action')
  @ApiOperation({ summary: 'Get GitHub OAuth Config' })
  getGithubConfig(@Param('action') action: OAuthActionType) {
    return this.githubAuthService.getConfig(action);
  }

  @Post('/login')
  @ApiOperation({ summary: 'GitHub OAuth Login' })
  @ApiBody({ type: IOAuth2LoginDto })
  @ApiResponse({ type: LoginResponseDto })
  async githubLogin(@Body() authDto: IOAuth2LoginDto) {
    return this.githubAuthService.loginOrRegister(authDto);
  }

  @Post('/bind')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'GitHub OAuth Bind' })
  @ApiBody({ type: IOAuth2LoginDto })
  @ApiResponse({ type: UserResponseDto })
  async githubBind(
    @Body() authDto: IOAuth2LoginDto,
    @Req() req: RequestWithUser,
  ) {
    return this.githubAuthService.bind(req.user.id, authDto);
  }
}
