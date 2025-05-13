import {
  Controller,
  Get,
  All,
  Req,
  Res,
  Body,
  Query,
  HttpStatus,
  Logger,
  BadGatewayException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { GatewayService } from './gateway.service';
import { map, catchError } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { ApiKeyGuard } from '../apikey/guards/api-key.guard';

@Controller('v1')
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);

  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  getIndex() {
    return 'Next API is running healthy';
  }

  @Post()
  postIndex() {
    return 'Next API is running healthy';
  }

  @UseGuards(ApiKeyGuard)
  @Get('models')
  getModels() {
    return 'Next API is running healthy';
  }
}
