import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import PrismaService from '../database/database.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService,PrismaService],
})
export class SettingsModule {}
