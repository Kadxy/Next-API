import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
