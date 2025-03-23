import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PasskeyService } from './passkey.service';
import { AuthGuard, RequestWithUser } from '../auth.guard';
import {
  PasskeyRegistrationStartDto,
  PasskeyRegistrationFinishDto,
} from '../dto/passkey-register.dto';
import {
  PasskeyAuthenticationStartDto,
  PasskeyAuthenticationFinishDto,
} from '../dto/passkey-auth.dto';

@ApiTags('Passkey Authentication')
@Controller('auth/passkey')
export class PasskeyController {
  constructor(private readonly passkeyService: PasskeyService) {}

  // === Registration ===
  @Get('register')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Start Passkey Registration' })
  async startRegistration(@Req() req: RequestWithUser) {
    return this.passkeyService.generateRegistrationOptions(req.user);
  }

  @Post('register')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Complete Passkey Registration' })
  @ApiBody({ type: PasskeyRegistrationFinishDto })
  async finishRegistration(
    @Req() req: RequestWithUser,
    @Body() body: PasskeyRegistrationFinishDto,
  ) {
    return this.passkeyService.verifyRegistrationResponse(
      req.user.id,
      body.attestationResponse,
    );
  }

  // === Authentication ===
  @Post('login/start')
  @ApiOperation({ summary: 'Start Passkey Authentication' })
  @ApiBody({ type: PasskeyAuthenticationStartDto })
  async startAuthentication(
    @Req() req: RequestWithUser,
    @Body() body: PasskeyAuthenticationStartDto,
  ) {
    return this.passkeyService.generateAuthenticationOptions(req.user);
  }

  @Post('login/finish')
  @ApiOperation({ summary: 'Complete Passkey Authentication' })
  @ApiBody({ type: PasskeyAuthenticationFinishDto })
  async finishAuthentication(
    @Req() req: RequestWithUser,
    @Body() body: PasskeyAuthenticationFinishDto,
  ) {
    return this.passkeyService.verifyAuthenticationResponse(
      req.user.id,
      body.assertionResponse,
    );
  }

  // === 管理接口 ===
  @Get('list')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'List User Passkeys' })
  async listPasskeys(@Req() req: RequestWithUser) {
    return this.passkeyService.getUserPasskeys(req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Passkey' })
  @ApiParam({ name: 'id', description: 'Passkey ID' })
  async deletePasskey(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.passkeyService.deletePasskey(req.user.id, parseInt(id));
  }
}
