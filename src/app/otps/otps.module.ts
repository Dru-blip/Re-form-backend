import { Module } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { OtpsController } from './otps.controller';
import PrismaService from '../database/database.service';

@Module({
  controllers: [OtpsController],
  providers: [OtpsService,PrismaService],
})
export class OtpsModule {}
