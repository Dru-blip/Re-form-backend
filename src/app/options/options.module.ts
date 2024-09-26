import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import PrismaService from '../database/database.service';

@Module({
  controllers: [OptionsController],
  providers: [OptionsService,PrismaService],
})
export class OptionsModule {}
