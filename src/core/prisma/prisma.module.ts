import { Module, Global } from '@nestjs/common';
import { MysqlPrismaService } from './mysql-prisma.service';
import { PostgresqlPrismaService } from './postgresql-prisma.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [MysqlPrismaService, PostgresqlPrismaService, PrismaService],
  exports: [MysqlPrismaService, PostgresqlPrismaService, PrismaService],
})
export class PrismaModule {}
