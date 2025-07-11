import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDisplayNameDto {
  @ApiProperty({ description: 'Display Name', example: 'John Doe' })
  @IsString({ message: 'Display name must be a string' })
  @IsNotEmpty({ message: 'Display name cannot be empty' })
  @MinLength(3, { message: '显示名称不能少于 3 个字符' })
  @MaxLength(15, { message: '显示名称不能超过 15 个字符' })
  displayName: string;
}
