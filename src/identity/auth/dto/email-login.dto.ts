import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class EmailLoginDto {
  @ApiProperty({
    description: 'Email address for login',
    example: 'example@nextchat.dev',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @ApiProperty({ description: 'Verification code' })
  @IsString({ message: 'Verification code must be a string' })
  @Length(6, 6, { message: 'Verification code must be 6 characters' })
  code: string;
}
