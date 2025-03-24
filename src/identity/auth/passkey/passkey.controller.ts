import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PasskeyService } from './passkey.service';
import { AuthGuard, RequestWithUser } from '../auth.guard';
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/server';
import {
  ListPasskeysResponseDto,
  UpdatePasskeyDisplayNameRequestDto,
} from './dto/passkeys.dto';

@ApiTags('Passkey Authentication')
@Controller('auth/passkey')
export class PasskeyController {
  constructor(private readonly passkeyService: PasskeyService) {}

  // === Registration ===
  @Get('register')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Start Passkey Registration' })
  async generateRegistrationOptions(@Req() req: RequestWithUser) {
    const { user } = req;
    return this.passkeyService.generateRegistrationOptions(user);
  }

  @Post('register')
  @UseGuards(AuthGuard)
  @ApiBody({ type: Object })
  @ApiOperation({ summary: 'Complete Passkey Registration' })
  async verifyRegistrationResponse(
    @Req() req: RequestWithUser,
    @Body() body: RegistrationResponseJSON,
  ) {
    const { user } = req;
    return this.passkeyService.verifyRegistrationResponse(user.id, body);
  }

  // === Authentication ===
  @Get('authentication')
  @ApiOperation({ summary: 'Start Passkey Authentication' })
  async generateAuthenticationOptions() {
    return this.passkeyService.generateAuthenticationOptions();
  }

  @Post('authentication')
  @ApiQuery({ name: 'state', type: String, required: true })
  @ApiBody({ type: Object })
  @ApiOperation({ summary: 'Complete Passkey Authentication' })
  async verifyAuthenticationResponse(
    @Query('state') state: string,
    @Body() body: AuthenticationResponseJSON,
  ) {
    return this.passkeyService.verifyAuthenticationResponse(state, body);
  }

  // === 用户管理接口 ===
  @Get()
  @UseGuards(AuthGuard)
  @ApiResponse({ type: ListPasskeysResponseDto })
  @ApiOperation({ summary: 'List User Passkeys' })
  async getUserPasskeys(@Req() req: RequestWithUser) {
    const { user } = req;
    return this.passkeyService.listUserPasskeys(user.id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update Passkey Display Name' })
  @ApiBody({ type: UpdatePasskeyDisplayNameRequestDto })
  @ApiParam({ name: 'id', description: 'Passkey ID' })
  async updatePasskeyDisplayName(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: UpdatePasskeyDisplayNameRequestDto,
  ) {
    const { user } = req;
    const { displayName } = body;
    // 不能 return, 因为包含了 bigint 类型，无法序列化
    await this.passkeyService.updatePasskeyDisplayName(
      user.id,
      id,
      displayName,
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Passkey' })
  @ApiParam({ name: 'id', description: 'Passkey ID' })
  async deletePasskey(@Req() req: RequestWithUser, @Param('id') id: string) {
    const { user } = req;
    return this.passkeyService.deletePasskey(user.id, id);
  }
}
