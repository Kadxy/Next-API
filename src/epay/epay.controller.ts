import { Controller, Get, Query, Res } from '@nestjs/common';
import { EpayService } from './epay.service';
import { EpayNotifyResult } from './interface/epay.interface';
import { FastifyReply } from 'fastify';

@Controller('epay')
export class EpayController {
  constructor(private readonly epayService: EpayService) {}

  @Get('notify')
  async handleNotify(
    @Query() query: EpayNotifyResult,
    @Res() reply: FastifyReply,
  ) {
    return this.epayService.handleNotify(query, reply);
  }
}
