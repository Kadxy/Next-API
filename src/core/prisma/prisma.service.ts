import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MysqlPrismaService } from './mysql-prisma.service';
import { PostgresqlPrismaService } from './postgresql-prisma.service';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  constructor(
    public readonly mysql: MysqlPrismaService,
    public readonly postgresql: PostgresqlPrismaService,
  ) {}

  async onModuleInit() {
    // Both services have their own onModuleInit, so we don't need to do anything here
  }

  async onModuleDestroy() {
    // Both services have their own onModuleDestroy, so we don't need to do anything here
  }
}
