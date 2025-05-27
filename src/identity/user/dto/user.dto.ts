import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from 'src/common/interceptors/transform.interceptor';

export class UserResponseData {
  // id 不返回

  @ApiProperty({ description: 'User UID' })
  uid: string;

  @ApiProperty({ description: 'User Display Name' })
  displayName: string;

  @ApiProperty({ description: 'User Avatar' })
  avatar: string;

  @ApiProperty({ description: 'User Email' })
  email: string;

  @ApiProperty({ description: 'User Name' })
  name: string;

  @ApiProperty({ description: 'User Phone' })
  phone: string;

  @ApiProperty({ description: 'User GitHub ID' })
  gitHubId: string;

  @ApiProperty({ description: 'User Google ID' })
  googleId: string;

  @ApiProperty({ description: 'User Two Factor Enabled' })
  twoFactorEnabled: boolean;

  // twoFactorSecret 不返回

  @ApiProperty({ description: 'User Is Active' })
  isActive: boolean;

  @ApiProperty({ description: 'User Is Admin' })
  isAdmin: boolean;

  @ApiProperty({ description: 'User Created At' })
  createdAt: string;

  @ApiProperty({ description: 'User Updated At' })
  updatedAt: string;

  // isDeleted 不返回

  @ApiProperty({ description: 'User Last Login At' })
  lastLoginAt: string;

  @ApiProperty({ description: 'User Wallet' })
  wallet: { balance: number };

  // Passkeys 不返回
}

export class LoginResponseData {
  @ApiProperty({ description: 'User Info', type: UserResponseData })
  user: UserResponseData;

  @ApiProperty({ description: 'JWT Token', type: String })
  token: string;
}

export class UserResponseDto extends createResponseDto<UserResponseData>(
  UserResponseData,
) {}

export class LoginResponseDto extends createResponseDto<LoginResponseData>(
  LoginResponseData,
) {}
