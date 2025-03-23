import { Module } from '@nestjs/common';
import { PasskeyService } from './passkey.service';
import { PasskeyController } from './passkey.controller';
import { UserModule } from '../../user/user.module';
import { JwtTokenService } from '../jwt.service';

@Module({
  imports: [UserModule],
  controllers: [PasskeyController],
  providers: [PasskeyService, JwtTokenService],
  exports: [PasskeyService],
})
export class PasskeyModule {}
