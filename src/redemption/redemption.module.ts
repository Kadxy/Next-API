import { Module } from '@nestjs/common';
import { RedemptionService } from './redemption.service';
import { RedemptionController } from './redemption.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { CryptoModule } from 'src/core/crypto/crypto.module';
import { AuthModule } from 'src/identity/auth/auth.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [PrismaModule, CryptoModule, AuthModule, WalletModule,CoreModule],
  providers: [RedemptionService],
  controllers: [RedemptionController],
  exports: [RedemptionService],
})
export class RedemptionModule {}
