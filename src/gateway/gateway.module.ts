import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { ApikeyModule } from '../apikey/apikey.module';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
    }),
    ApikeyModule,
  ],
  providers: [GatewayService],
  controllers: [GatewayController],
})
export class GatewayModule {}
