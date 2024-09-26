import { Module } from '@nestjs/common';
import PrismaService from './database.service';

// Module For Managing and Connecting Databases
@Module({
  imports: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}

