import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendEmailLoginCodeDto {
  @ApiProperty({
    description: 'Email address to receive verification code',
    example: 'example@worldai.app',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;
}
