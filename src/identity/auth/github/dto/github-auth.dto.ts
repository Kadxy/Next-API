import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GitHubAuthDto {
  @ApiProperty({
    description: 'GitHub OAuth授权码',
    example: 'a1b2c3d4e5f6g7h8',
  })
  @IsString({ message: '授权码必须是字符串' })
  @IsNotEmpty({ message: '授权码不能为空' })
  code: string;

  @ApiProperty({
    description: 'GitHub OAuth授权状态',
    example: 'a1b2c3d4e5f6g7h8',
  })
  @IsString({ message: '授权状态必须是字符串' })
  @IsNotEmpty({ message: '授权状态不能为空' })
  state: string;
}
