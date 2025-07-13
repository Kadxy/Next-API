import { Controller } from '@nestjs/common';
import { BillingService } from './billing.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Billing')
@Controller('billing')
@ApiBearerAuth()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}
}
