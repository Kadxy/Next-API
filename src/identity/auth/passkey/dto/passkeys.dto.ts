import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { createResponseDto } from 'src/common/interceptors/transform.interceptor';

export class ListPasskeysResponseData {
  @ApiProperty({ description: 'Passkey ID', example: 'a1b2c3d4j0' })
  id: string;

  @ApiProperty({ description: 'Passkey Display Name', example: 'My Passkey' })
  displayName: string;

  @ApiProperty({ description: 'Passkey Last Used At' })
  lastUsedAt: string;

  @ApiProperty({ description: 'Passkey Created At' })
  createdAt: string;

  @ApiProperty({ description: 'Passkey Updated At' })
  updatedAt: string;
}

export class UpdatePasskeyDisplayNameRequestDto {
  @ApiProperty({ description: 'Passkey Display Name', example: 'My Passkey' })
  @IsString()
  @IsNotEmpty()
  displayName: string;
}

export class ListPasskeysResponseDto extends createResponseDto<
  ListPasskeysResponseData[]
>(ListPasskeysResponseData, {
  description: 'List Passkeys Response',
  isArray: true,
  example: [
    {
      id: 'a1b2c3d4j0',
      displayName: 'My Passkey',
      createdAt: '2025-01-01 12:00:00',
      updatedAt: '2025-01-01 18:00:00',
    },
    {
      id: 'a1b2c3d4j1',
      displayName: 'My Passkey 2',
      createdAt: '2025-01-01 12:00:00',
      updatedAt: '2025-01-01 18:00:00',
    },
  ],
}) {}
