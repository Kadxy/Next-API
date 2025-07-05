import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDisplayNameDto {
  @ApiProperty({ description: 'Display Name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  displayName: string;
}
