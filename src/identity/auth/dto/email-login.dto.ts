import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class EmailLoginDto {
  @ApiProperty({
    description: 'Email address for login',
    example: 'example@worldai.app',
    format: 'email',
  })
  @IsEmail(
    {
      domain_specific_validation: true,
      host_blacklist: ['temp-mail'],
    },
    { message: 'Please enter a valid email address' },
  )
  email: string;

  @ApiProperty({ description: 'Verification code' })
  @IsString({ message: 'Verification code must be a string' })
  @Length(6, 6, { message: 'Verification code must be 6 characters' })
  code: string;
}
