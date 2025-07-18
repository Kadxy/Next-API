import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EpayController } from './epay.controller';
import { EpayService } from './epay.service';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { AuthModule } from 'src/identity/auth/auth.module';
import { UlidModule } from 'src/core/ulid/ulid.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [HttpModule, PrismaModule, UlidModule, AuthModule, WalletModule],
  providers: [EpayService],
  controllers: [EpayController],
})
export class EpayModule {}
