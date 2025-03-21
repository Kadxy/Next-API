import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config/config.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './core/cache/redis.module';

@Module({
  imports: [ConfigModule, PrismaModule, RedisModule, AuthModule],
})
export class AppModule {}
