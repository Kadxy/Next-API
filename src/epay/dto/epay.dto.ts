import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from 'src/common/interceptors/transform.interceptor';
import { IsEnum, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import {
  EpayCreateOrderResponseV1,
  EpayCreateOrderResponseV2,
  EpayQueryOrderResponse,
  PaymentMethod,
} from '../interface/epay.interface';

export class EpayPriceResponseData {
  @ApiProperty({ description: '充值美元额度, 2位小数', example: '100' })
  quota: string;

  @ApiProperty({ description: '人民币价格, 2位小数', example: '650' })
  amount: string;

  @ApiProperty({ description: '美元兑换人民币汇率, 2位小数', example: '6.50' })
  exchangeRate: string;

  @ApiProperty({ description: '原始汇率, 2位小数', example: '8.00' })
  originalExchangeRate: string;

  @ApiProperty({ description: '原始金额, 2位小数', example: '800' })
  originalAmount: string;
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

  @ApiProperty({
    description: '支付方式',
    example: 'wechat',
    enum: PaymentMethod,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}

export class QueryOrderResponseDto extends createResponseDto(
  EpayQueryOrderResponse,
) {}

export class RechargeResponseV2Dto extends createResponseDto(
  EpayCreateOrderResponseV2,
) {}

export class RechargeResponseV1Dto extends createResponseDto(
  EpayCreateOrderResponseV1,
) {}
