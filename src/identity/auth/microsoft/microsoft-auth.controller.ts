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
import { MicrosoftAuthService } from './microsoft-auth.service';
import {
  LoginResponseDto,
  UserResponseDto,
} from 'src/identity/user/dto/user.dto';
import { IOAuth2LoginDto, OAuthActionType } from '../oauth/oauth.interface';
import { AuthGuard, RequestWithUser } from '../auth.guard';

@ApiTags('Microsoft Authentication')
@Controller('auth/microsoft')
export class MicrosoftAuthController {
  constructor(private readonly microsoftAuthService: MicrosoftAuthService) {}

  @Get('/config/:action')
  @ApiOperation({ summary: 'Get Microsoft OAuth Config' })
  getMicrosoftConfig(@Param('action') action: OAuthActionType) {
    return this.microsoftAuthService.getConfig(action);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Microsoft OAuth Login' })
  @ApiResponse({ type: LoginResponseDto })
  @ApiBody({ type: IOAuth2LoginDto })
  async microsoftLogin(@Body() authDto: IOAuth2LoginDto) {
    return this.microsoftAuthService.loginOrRegister(authDto);
  }

  @Post('/bind')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Microsoft OAuth Bind' })
  @ApiResponse({ type: UserResponseDto })
  @ApiBody({ type: IOAuth2LoginDto })
  async microsoftBind(
    @Body() authDto: IOAuth2LoginDto,
    @Req() req: RequestWithUser,
  ) {
    return this.microsoftAuthService.bind(req.user.id, authDto);
  }
}
