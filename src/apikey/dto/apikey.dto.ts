import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { createResponseDto } from 'src/common/interceptors/transform.interceptor';

export class CreateApiKeyRequestDto {
  @ApiProperty({ description: '显示名称' })
  @IsString({ message: '显示名称必须为字符串' })
  @IsNotEmpty({ message: '显示名称不能为空' })
  @Length(1, 32, { message: '显示名称长度必须在1到32之间' })
  displayName: string;

  @ApiProperty({ description: '钱包UID' })
  @IsString({ message: '钱包UID必须为字符串' })
  @IsNotEmpty({ message: '钱包UID不能为空' })
  walletUid: string;
}

export class UpdateApiKeyDisplayNameRequestDto {
  @ApiProperty({ description: '显示名称' })
  @IsString({ message: '显示名称必须为字符串' })
  @IsNotEmpty({ message: '显示名称不能为空' })
  @Length(1, 15, { message: '显示名称长度必须在1到15之间' })
  displayName: string;
}

export class CreateApiKeyResponseData {
  @ApiProperty({ description: '原始密钥' })
  rawKey: string;
}

export class CreateApiKeyResponseDto extends createResponseDto<CreateApiKeyResponseData>(
  CreateApiKeyResponseData,
) {}

export class ListApiKeyResponseItemWalletItemData {
  @ApiProperty({ description: '钱包UID' })
  uid: string;

  @ApiProperty({ description: '钱包名称' })
  displayName: string;
}

export class ListApiKeyResponseItemData {
  @ApiProperty({ description: '哈希密钥' })
  hashKey: string;

  @ApiProperty({ description: '是否有效' })
  isActive: boolean;

  @ApiProperty({
    description: '前4位和后4位拼接的字符串, 如abc123xy即rawKey为sk-abc1**...**23xy',
    example: 'abc123xy',
  })
  preview: string;

  @ApiProperty({ description: '显示名称' })
  displayName: string;

  @ApiProperty({ description: '最后使用时间' })
  lastUsedAt: Date;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  @ApiProperty({ description: '钱包' })
  wallet: ListApiKeyResponseItemWalletItemData;
}

export class ListApiKeyResponseDto extends createResponseDto<ListApiKeyResponseItemData>(
  ListApiKeyResponseItemData,
  {
    isArray: true,
  },
) {}

export class UpdateApiKeyDisplayNameResponseDto extends createResponseDto<ListApiKeyResponseItemData>(
  ListApiKeyResponseItemData,
) {}
