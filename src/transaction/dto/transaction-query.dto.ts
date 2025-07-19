import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { TransactionStatus, TransactionType } from '@prisma-main-client/enums';
import { createResponseDto } from 'src/common/interceptors/transform.interceptor';

// 查询参数基类
export class BaseTransactionQueryDto {
  @ApiProperty({ description: '页码', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ description: '每页数量', example: 20, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @ApiProperty({
    description: '开始日期',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: '结束日期',
    example: '2024-01-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: '交易类型',
    enum: TransactionType,
    required: false,
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({
    description: '交易状态',
    enum: TransactionStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;
}

// 用户自己的交易查询
export class SelfTransactionQueryDto extends BaseTransactionQueryDto {}

// 钱包交易查询（钱包所有者使用）
export class WalletTransactionQueryDto extends BaseTransactionQueryDto {
  @ApiProperty({ description: '指定用户ID', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;
}

// 交易记录响应数据
export class TransactionRecordData {
  @ApiProperty({ description: '业务ID' })
  businessId: string;

  @ApiProperty({ description: '交易类型', enum: TransactionType })
  type: TransactionType;

  @ApiProperty({ description: '金额（Decimal类型）' })
  amount: any; // Prisma Decimal 类型

  @ApiProperty({ description: '描述' })
  description: string;

  @ApiProperty({ description: '状态', enum: TransactionStatus })
  status: TransactionStatus;

  @ApiProperty({ description: '错误信息', required: false })
  errorMessage?: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  @ApiProperty({ description: 'API Key信息', required: false })
  apiKey?: {
    displayName: string;
  };
}

// 分页响应数据
export class TransactionListData {
  @ApiProperty({ description: '交易记录列表', type: [TransactionRecordData] })
  records: TransactionRecordData[];

  @ApiProperty({ description: '总数量' })
  total: number;

  @ApiProperty({ description: '当前页码' })
  page: number;

  @ApiProperty({ description: '每页数量' })
  pageSize: number;

  @ApiProperty({ description: '总页数' })
  totalPages: number;
}

// 交易详情数据（ApiCallRecord去除敏感字段）
export class TransactionDetailData {
  @ApiProperty({ description: '业务ID' })
  businessId: string;

  @ApiProperty({ description: '客户端IP' })
  clientIp: string;

  @ApiProperty({ description: '用户代理' })
  userAgent: string;

  @ApiProperty({ description: '外部追踪ID' })
  externalTraceId: string;

  @ApiProperty({ description: '开始时间' })
  startTime: Date;

  @ApiProperty({ description: '结束时间' })
  endTime: Date;

  @ApiProperty({ description: '持续时间(毫秒)' })
  durationMs: number;

  @ApiProperty({ description: '上游ID' })
  upstreamId: number;

  @ApiProperty({ description: '模型名称' })
  model: string;

  @ApiProperty({ description: '服务提供商' })
  provider: string;

  @ApiProperty({ description: '计费类型' })
  billingType: string;

  @ApiProperty({ description: '计费数据' })
  billingData: any;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}

// 响应DTO
export class TransactionListResponseDto extends createResponseDto(
  TransactionListData,
) {}

export class TransactionDetailResponseDto extends createResponseDto(
  TransactionDetailData,
) {}
