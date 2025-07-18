import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from 'src/common/interceptors/transform.interceptor';
import { IsEnum, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { PaymentMethod } from '../interface/epay.interface';

export class EpayPriceResponseData {
  /** 充值美元额度 */
  quota: string;

  /** 人民币价格 */
  amount: string;

  /** 美元兑换人民币汇率 */
  exchangeRate: string;
}

export class EpayPriceRequestDto {
  @ApiProperty({ description: '充值美元额度', example: '100' })
  @IsString()
  @IsNotEmpty()
  quota: string;
}

export class EpayPriceResponseDto extends createResponseDto(
  EpayPriceResponseData,
) {}

export class EpayRechargeRequestDto {
  @ApiProperty({ description: '充值美元额度', example: '100' })
  @IsString()
  @IsNotEmpty()
  quota: string;

  @ApiProperty({ description: '支付方式', example: 'wechat' })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  payType: PaymentMethod;
}
