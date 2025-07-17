import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaMainDbService } from './prisma-main-db.service';
import { PrismaDetailDbService } from './prisma-detail-db.service';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  constructor(
    public readonly main: PrismaMainDbService,
    public readonly detail: PrismaDetailDbService,
  ) {}

  async onModuleInit() {
    // Both services have their own onModuleInit, so we don't need to do anything here
  }

  async onModuleDestroy() {
    // Both services have their own onModuleDestroy, so we don't need to do anything here
  }
}
