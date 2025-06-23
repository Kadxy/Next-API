import { Controller, Get, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { AuthGuard } from '../identity/auth/auth.guard';
import { AdminAuthGuard } from '../identity/auth/admin-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Billing')
@Controller('billing')
@ApiBearerAuth()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('stats')
  @UseGuards(AuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Get billing statistics (Admin only)' })
  async getBillingStats() {
    return await this.billingService.getBillingStats();
  }
}
