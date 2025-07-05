import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDisplayNameDto {
  @ApiProperty({ description: 'Display Name', example: 'John Doe' })
  @IsString({ message: 'Display name must be a string' })
  @IsNotEmpty({ message: 'Display name cannot be empty' })
  @MinLength(4, { message: 'Display name must be at least 4 character' })
  @MaxLength(31, {
    message: 'Display name cannot be longer than 31 characters',
  })
  displayName: string;
}
