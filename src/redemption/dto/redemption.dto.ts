import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsString, Length, IsOptional } from 'class-validator';
import { RedemptionService } from '../redemption.service';
import { createResponseDto } from 'src/common/interceptors/transform.interceptor';

export class CreateRedemptionCodeDto {
  @ApiProperty({ description: '充值金额，整数', example: 1 })
  @IsInt({ message: 'amount must be integer' })
  @Min(1, { message: 'amount must be greater than 0' })
  amount: number;

  @ApiProperty({ description: '备注', required: false, example: '测试' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class CreateRedemptionCodeResponseDto {
  @ApiProperty({ description: '兑换码ID', example: 1 })
  id: number;

  @ApiProperty({ description: '兑换码', example: 'abcdabcdabcdabcd' })
  code: string;

  @ApiProperty({ description: '充值金额', example: 1 })
  amount: number;

  @ApiProperty({ description: '备注', example: '测试' })
  remark: string;

  @ApiProperty({
    description: '兑换码展示',
    example: 'ABCD-ABCD-ABCD-ABCD',
  })
  displayCode: string;

  @ApiProperty({ description: '过期时间', example: '2025-06-22T10:00:00.000Z' })
  expiredAt: Date;
}

export class RedeemCodeDto {
  @ApiProperty({
    description: '小写原始兑换码, 不得包含连字符, 不得包含大写字母',
    example: 'abcd1234abcd1234abcd1234',
  })
  @IsString()
  @Length(
    RedemptionService.REDEMPTION_CODE_LENGTH,
    RedemptionService.REDEMPTION_CODE_LENGTH,
    {
      message: `兑换码长度必须为 ${RedemptionService.REDEMPTION_CODE_LENGTH} 个字符`,
    },
  )
  code: string;

  @ApiProperty({ description: '钱包UID', example: '1234567890' })
  @IsString()
  walletUid: string;
}

export class RedeemCodeResponseData {
  @ApiProperty({ description: '兑换额度, 整数', example: 2 })
  quota: string;
}

export class RedeemCodeResponseDto extends createResponseDto(
  RedeemCodeResponseData,
) {}

export class GetAllRedemptionCodesResponseDto {
  @ApiProperty({
    description: '兑换码列表',
    type: [CreateRedemptionCodeResponseDto],
  })
  list: (CreateRedemptionCodeResponseDto & {
    redeemer: { id: string; uid: string; displayName: string; email: string };
  })[];
}
