import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  Min,
  IsString,
  Length,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { RedemptionService } from '../redemption.service';

export class CreateRedemptionCodeDto {
  @ApiProperty({ description: '充值金额，整数', example: 1 })
  @IsInt({ message: 'amount must be integer' })
  @Min(1, { message: 'amount must be greater than 0' })
  amount: number;

  @ApiProperty({
    description: '过期时间，默认 90 天后',
    required: false,
    example: '2025-06-22T10:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  expiredAt?: Date;

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
  @ApiProperty({ description: '兑换码', example: 'abcdabcdabcdabcd' })
  @IsString()
  @Length(
    RedemptionService.REDEMPTION_CODE_LENGTH,
    RedemptionService.REDEMPTION_CODE_LENGTH,
    {
      message: `code must be ${RedemptionService.REDEMPTION_CODE_LENGTH} characters`,
    },
  )
  code: string;
}

export class RedeemCodeResponseDto {
  @ApiProperty({ description: '最新余额', example: '2' })
  balance: string;
}

export class GetAllRedemptionCodesResponseDto {
  @ApiProperty({
    description: '兑换码列表',
    type: [CreateRedemptionCodeResponseDto],
  })
  list: (CreateRedemptionCodeResponseDto & {
    redeemer: { id: string; uid: string; displayName: string; email: string };
  })[];
}
