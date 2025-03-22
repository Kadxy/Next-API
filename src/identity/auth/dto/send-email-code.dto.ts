import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendEmailCodeDto {
  @ApiProperty({
    description: 'Email address to receive verification code',
    example: 'example@nextchat.dev',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;
}
