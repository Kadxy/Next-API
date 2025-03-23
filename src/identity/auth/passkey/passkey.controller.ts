import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  ApiTags,
} from '@nestjs/swagger';
import { PasskeyService } from './passkey.service';
import { AuthGuard, RequestWithUser } from '../auth.guard';
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/server';

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

  // === 管理接口 ===
  @Get('')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'List User Passkeys' })
  async getUserPasskeys(@Req() req: RequestWithUser) {
    const { user } = req;
    return this.passkeyService.getUserPasskeys(user.id);
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
