import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from 'src/common/interceptors/transform.interceptor';

export class ListWalletResponseItemData {
  @ApiProperty({ description: '钱包唯一标识符' })
  uid: string;

  @ApiProperty({ description: '钱包余额' })
  balance: string;

  @ApiProperty({ description: '钱包名称' })
  displayName: string;
}

export class ListWalletResponseDto extends createResponseDto<
  Array<ListWalletResponseItemData>
>(ListWalletResponseItemData, {
  isArray: true,
}) {}
