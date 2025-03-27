import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApikeyService } from './apikey.service';
import { AuthGuard, RequestWithUser } from 'src/identity/auth/auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('apikey')
@UseGuards(AuthGuard)
export class ApikeyController {
  constructor(private readonly apikeyService: ApikeyService) {}

  @Get()
  @ApiOperation({ summary: '获取用户API密钥列表' })
  @ApiResponse({ isArray: true })
  async getApiKeys(@Req() req: RequestWithUser) {
    const { user } = req;
    return this.apikeyService.getUserApiKeys(user.id);
  }

  @Post()
  @ApiOperation({ summary: '创建API密钥' })
  async createApiKey(@Req() req: RequestWithUser) {
    const { user } = req;
    return this.apikeyService.createApiKey(user.id);
  }

  @Patch(':hashKey')
  @ApiOperation({ summary: '更新API密钥名称' })
  async updateApiKeyDisplayName(
    @Req() req: RequestWithUser,
    @Param('hashKey') hashKey: string,
    @Body() body: { displayName: string },
  ) {
    const { user } = req;
    return this.apikeyService.updateApiKeyDisplayName(
      user.id,
      hashKey,
      body.displayName,
    );
  }

  @Delete(':hashKey')
  @ApiOperation({ summary: '删除API密钥' })
  async deleteApiKey(
    @Req() req: RequestWithUser,
    @Param('hashKey') hashKey: string,
  ) {
    const { user } = req;
    return this.apikeyService.deleteApiKey(user.id, hashKey);
  }
}
