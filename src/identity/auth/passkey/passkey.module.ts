import { Module } from '@nestjs/common';
import { PasskeyService } from './passkey.service';
import { PasskeyController } from './passkey.controller';
import { UserModule } from '../../user/user.module';
import { JwtTokenService } from '../jwt.service';
import { AuthGuard } from '../auth.guard';

@Module({
  imports: [UserModule],
  controllers: [PasskeyController],
  providers: [PasskeyService],
  exports: [PasskeyService],
})
export class PasskeyModule {}
