import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';
import { createResponseDto } from 'src/common/interceptors/transform.interceptor';

export class ListWalletResponseItemData {
  @ApiProperty({ description: '是否所有者' })
  isOwner: boolean;

  @ApiProperty({ description: '钱包唯一标识符' })
  uid: string;

  @ApiProperty({ description: '钱包余额' })
  balance: string;

  @ApiProperty({ description: '钱包名称' })
  displayName: string;

  @ApiProperty({ description: '钱包成员额度限制, isOwner=false 时展示' })
  creditLimit?: number;

  @ApiProperty({ description: '钱包成员已使用额度, isOwner=false 时展示' })
  creditUsed?: number;
}

export class ListWalletResponseDto extends createResponseDto<
  Array<ListWalletResponseItemData>
>(ListWalletResponseItemData, { isArray: true }) {}

export class AddMemberDto {
  @ApiProperty({ description: '用户UID' })
  @IsString()
  memberUid: string;

  @ApiProperty({ description: '钱包成员别名' })
  @IsString()
  alias: string;

  @ApiProperty({ description: '额度限制' })
  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(0, { message: '额度限制不能小于0' })
  creditLimit: number;
}

export class UpdateMemberDto extends PartialType(AddMemberDto) {}


export class WalletDetailResponseMemberUserItemData {
  @ApiProperty({ description: '用户UID' })
  uid: string;

  @ApiProperty({ description: '用户显示名称' })
  displayName: string;
}

export class WalletDetailResponseMemberItemData {
  @ApiProperty({ description: '钱包成员别名' })
  alias: string;

  @ApiProperty({ description: '钱包成员额度限制' })
  creditLimit: string;

  @ApiProperty({ description: '钱包成员已使用额度' })
  creditUsed: string;

  @ApiProperty({ description: '是否激活' })
  isActive: string;

  @ApiProperty({ description: '用户信息' })
  user: WalletDetailResponseMemberUserItemData;
}

export class WalletDetailResponseItemData {
  @ApiProperty({ description: '钱包唯一标识符' })
  uid: string;

  @ApiProperty({ description: '钱包名称' })
  displayName: string;

  @ApiProperty({ description: '钱包余额' })
  balance: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: string;

  @ApiProperty({ description: '更新时间' })
  updatedAt: string;

  @ApiProperty({
    description: '钱包成员',
    type: WalletDetailResponseMemberItemData,
    isArray: true,
  })
  members: WalletDetailResponseMemberItemData[];
}

export class WalletDetailResponseDto extends createResponseDto<WalletDetailResponseItemData>(
  WalletDetailResponseItemData,
) {}

export class UpdateWalletDisplayNameDto {
  @ApiProperty({ description: '钱包成员别名' })
  @IsString()
  displayName: string;
}
