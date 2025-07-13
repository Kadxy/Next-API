import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CoreModule } from 'src/core/core.module';
import { WalletController } from './wallet.controller';
import { AuthModule } from 'src/identity/auth/auth.module';
import { UserModule } from '../identity/user/user.module';

@Module({
  imports: [CoreModule, AuthModule, UserModule],
  providers: [WalletService],
  exports: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
