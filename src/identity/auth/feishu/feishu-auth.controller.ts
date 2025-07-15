import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FeishuAuthService } from './feishu-auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto, UserResponseDto } from 'src/identity/user/dto/user.dto';
import { IOAuth2LoginDto, OAuthActionType } from '../oauth/oauth.interface';
import { AuthGuard, RequestWithUser } from '../auth.guard';

@ApiTags('Feishu Authentication')
@Controller('auth/feishu')
export class FeishuAuthController {
  constructor(private readonly feishuAuthService: FeishuAuthService) {}

  @Get('/config/:action')
  @ApiOperation({ summary: 'Get Feishu OAuth Config' })
  getFeishuConfig(@Param('action') action: OAuthActionType) {
    return this.feishuAuthService.getConfig(action);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Feishu OAuth Login' })
  @ApiBody({ type: IOAuth2LoginDto })
  @ApiResponse({ type: LoginResponseDto })
  async feishuLogin(@Body() authDto: IOAuth2LoginDto) {
    return this.feishuAuthService.loginOrRegister(authDto);
  }

  @Post('/bind')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Feishu OAuth Bind' })
  @ApiBody({ type: IOAuth2LoginDto })
  @ApiResponse({ type: UserResponseDto })
  async feishuBind(
    @Body() authDto: IOAuth2LoginDto,
    @Req() req: RequestWithUser,
  ) {
    return this.feishuAuthService.bind(req.user.id, authDto);
  }
}
