import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { BillStatus } from '@prisma-mysql-client/client';
import { createResponseDto } from 'src/common/interceptors/transform.interceptor';

export class QueryBillingLogsDto {
  @ApiPropertyOptional({
    description: '成员UID（钱包owner查询特定成员时使用）',
  })
  @IsOptional()
  @IsString()
  memberUid?: string;

  @ApiPropertyOptional({ description: '模型名称' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({ description: '计费状态', enum: BillStatus })
  @IsOptional()
  @IsEnum(BillStatus)
  billStatus?: BillStatus;

  @ApiPropertyOptional({ description: '页码', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '每页条数',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}

export class BillingLogItemData {
  @ApiProperty({ description: '请求ID' })
  requestId: string;

  @ApiProperty({ description: '钱包UID' })
  walletUid: string;

  @ApiProperty({ description: '用户UID' })
  userUid: string;

  @ApiProperty({ description: '模型名称' })
  model: string;

  @ApiProperty({ description: '开始时间' })
  startTime: Date;

  @ApiProperty({ description: '结束时间' })
  endTime: Date;

  @ApiProperty({ description: '耗时(毫秒)' })
  durationMs: number;

  @ApiProperty({ description: '输入token数' })
  inputToken: number;

  @ApiProperty({ description: '输出token数' })
  outputToken: number;

  @ApiProperty({ description: '费用' })
  cost: string;

  @ApiProperty({ description: '计费状态', enum: BillStatus })
  billStatus: BillStatus;

  @ApiProperty({ description: '错误信息', required: false })
  errorMessage?: string | null;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}

export class BillingLogListData {
  @ApiProperty({ description: '记录列表', type: [BillingLogItemData] })
  items: BillingLogItemData[];

  @ApiProperty({ description: '总记录数' })
  total: number;

  @ApiProperty({ description: '当前页' })
  page: number;

  @ApiProperty({ description: '每页条数' })
  pageSize: number;

  @ApiProperty({ description: '总页数' })
  totalPages: number;
}

export class BillingLogListResponseDto extends createResponseDto<BillingLogListData>(
  BillingLogListData,
) {}

// PostgreSQL 详细日志数据
export class BillingLogDetailData {
  @ApiProperty({ description: '请求ID' })
  requestId: string;

  @ApiProperty({ description: '钱包UID' })
  walletUid: string;

  @ApiProperty({ description: '用户UID' })
  userUid: string;

  @ApiProperty({ description: '钱包所有者UID' })
  ownerUid: string;

  @ApiProperty({ description: 'API Key预览' })
  apiKeyPreview: string;

  @ApiProperty({ description: '请求头', required: false })
  requestHeaders?: any;

  @ApiProperty({ description: '请求内容', required: false })
  requestBody?: any;

  @ApiProperty({ description: '响应头', required: false })
  responseHeaders?: any;

  @ApiProperty({ description: '响应内容', required: false })
  responseBody?: any;

  @ApiProperty({ description: '是否流式响应' })
  responseStream: boolean;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}

export class BillingLogDetailResponseDto extends createResponseDto<BillingLogDetailData>(
  BillingLogDetailData,
) {}
