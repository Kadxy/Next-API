import { Controller } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Billing')
@Controller('billing')
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly billingService: TransactionService) {}
}
