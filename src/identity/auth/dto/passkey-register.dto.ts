import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class PasskeyRegistrationStartDto {
  @ApiProperty({ description: 'Optional name for the passkey device' })
  @IsString()
  @IsOptional()
  name?: string;
}

export class PasskeyRegistrationFinishDto {
  @ApiProperty({ description: 'WebAuthn registration attestation response' })
  @IsNotEmpty()
  @IsString()
  attestationResponse: string;
}
