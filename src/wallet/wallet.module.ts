import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CoreModule } from 'src/core/core.module';
import { WalletController } from './wallet.controller';
import { AuthModule } from 'src/identity/auth/auth.module';

@Module({
  imports: [CoreModule, AuthModule],
  providers: [WalletService],
  exports: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
