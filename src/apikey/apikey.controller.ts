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
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CreateApiKeyRequestDto,
  CreateApiKeyResponseDto,
  ListApiKeyResponseDto,
  UpdateApiKeyDisplayNameRequestDto,
  UpdateApiKeyDisplayNameResponseDto,
} from './dto/apikey.dto';

@Controller('apikey')
@UseGuards(AuthGuard)
export class ApikeyController {
  constructor(private readonly apikeyService: ApikeyService) {}

  @Get()
  @ApiOperation({ summary: '获取用户API密钥列表' })
  @ApiResponse({ type: ListApiKeyResponseDto })
  async getApiKeys(@Req() req: RequestWithUser) {
    const { user } = req;
    return this.apikeyService.listApiKeys(user.id);
  }

  @Post()
  @ApiOperation({ summary: '创建API密钥' })
  @ApiBody({ type: CreateApiKeyRequestDto })
  @ApiResponse({ type: CreateApiKeyResponseDto })
  async createApiKey(
    @Req() req: RequestWithUser,
    @Body() body: CreateApiKeyRequestDto,
  ) {
    const { user } = req;
    const { displayName, walletUid } = body;
    return this.apikeyService.createApiKey(displayName, walletUid, user.id);
  }

  @Patch(':hashKey')
  @ApiOperation({ summary: '更新API密钥名称' })
  @ApiBody({ type: UpdateApiKeyDisplayNameRequestDto })
  @ApiResponse({ type: UpdateApiKeyDisplayNameResponseDto })
  async updateApiKeyDisplayName(
    @Req() req: RequestWithUser,
    @Param('hashKey') hashKey: string,
    @Body() body: UpdateApiKeyDisplayNameRequestDto,
  ) {
    const { user } = req;
    const { displayName } = body;
    return this.apikeyService.updateApiKeyDisplayName(
      hashKey,
      displayName,
      user.id,
    );
  }

  @Delete(':hashKey')
  @ApiOperation({ summary: '删除API密钥' })
  async deleteApiKey(
    @Req() req: RequestWithUser,
    @Param('hashKey') hashKey: string,
  ) {
    const { user } = req;
    return this.apikeyService.deleteApiKey(hashKey, user.id);
  }
}
