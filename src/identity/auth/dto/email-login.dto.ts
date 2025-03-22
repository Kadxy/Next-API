import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsObject, IsString, Length, Matches } from 'class-validator';
import { createResponseDto } from 'src/common/interceptors/transform.interceptor';

export class EmailLoginDto {
  @ApiProperty({
    description: 'Email address for login',
    example: 'example@nextchat.dev',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Verification code',
    example: '1234',
    minLength: 4,
    maxLength: 4,
    pattern: '^[0-9]{4}$',
  })
  @IsString({ message: 'Verification code must be a string' })
  @Length(4, 4, { message: 'Verification code must be exactly 4 characters' })
  @Matches(/^[0-9]{4}$/, { message: 'Verification code must be 4 digits' })
  code: string;
}

class LoginResponseUserData {
  // @ApiProperty({ description: 'User ID', example: '1' })
  // id: number;

  @ApiProperty({
    description: 'User UUID',
    example: 'b5273d31-7492-4aab-a594-ab82333c1b3b',
  })
  uuid: string;

  @ApiProperty({ description: 'User email', example: 'example@nextchat.dev' })
  email: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'User status', example: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  @ApiProperty({
    description: 'User created at',
    example: '2025-03-08T09:44:25.749Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'User updated at',
    example: '2025-03-08T09:44:25.749Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'User wallet balance',
    example: '6.34',
    type: 'object',
    properties: {
      balance: {
        type: 'string',
        example: '6.34',
      },
    },
  })
  @IsObject()
  wallet: {
    balance: string;
  };
}
class LoginResponseData {
  @ApiProperty({
    description: 'JWT Token',
    example: 'eyJhbGciOiJIUzI1N...',
  })
  token: string;

  @ApiProperty({ description: 'User', type: LoginResponseUserData })
  @Type(() => LoginResponseUserData)
  @IsObject()
  user: LoginResponseUserData;
}

export class LoginResponseDto extends createResponseDto<LoginResponseData>(LoginResponseData, {
  example: {
    code: 0,
    msg: 'Success',
    data: {
      token: '1234567890',
      user: {
        // id: 1,
        uuid: 'b5273d35-7492-4aab-a594-ab82852c1b3b',
        email: '2230318258@qq.com',
        name: null,
        status: 'ACTIVE',
        createdAt: '2025-03-08T09:44:25.749Z',
        updatedAt: '2025-03-08T09:44:25.749Z',
        wallet: {
          balance: '-0.003',
        },
      },
    },
  },
}) {}

export class SelfResponseDto extends createResponseDto<LoginResponseUserData>(LoginResponseUserData, {
  example: {
    code: 0,
    msg: 'Success',
    data: {
      uuid: 'b5273d35-7492-4aab-a594-ab82852c1b3b',
      email: '2230318258@qq.com',
      name: null,
      status: 'ACTIVE',
      createdAt: '2025-03-08T09:44:25.749Z',
      updatedAt: '2025-03-08T09:44:25.749Z',
    },
  },
}) {}
