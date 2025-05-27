import { Module } from '@nestjs/common';
import { ApikeyService } from './apikey.service';
import { ApikeyController } from './apikey.controller';
import { CoreModule } from 'src/core/core.module';
import { AuthModule } from 'src/identity/auth/auth.module';
import { ApiKeyEventService } from './events/api-key-event/apikey-event.service';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [CoreModule, AuthModule, WalletModule],
  controllers: [ApikeyController],
  providers: [ApikeyService, ApiKeyEventService],
  exports: [ApikeyService],
})
export class ApikeyModule {}
