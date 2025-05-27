import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CoreModule } from 'src/core/core.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [CoreModule, WalletModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
