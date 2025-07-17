import { Module, Global } from '@nestjs/common';
import { PrismaMainDbService } from './prisma-main-db.service';
import { PrismaDetailDbService } from './prisma-detail-db.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaMainDbService, PrismaDetailDbService, PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
