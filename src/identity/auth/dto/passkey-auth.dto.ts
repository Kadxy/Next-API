import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PasskeyAuthenticationStartDto {
  // 空的请求体，只需要请求即可获取挑战
}

export class PasskeyAuthenticationFinishDto {
  @ApiProperty({ description: 'WebAuthn authentication assertion response' })
  @IsNotEmpty()
  @IsString()
  assertionResponse: string;
}
