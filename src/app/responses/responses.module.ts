import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import PrismaService from '../database/database.service';
import { QuestionsService } from '../questions/questions.service';
import { ExcelService } from './excel.service';

@Module({
  controllers: [ResponsesController],
  providers: [ResponsesService,PrismaService,QuestionsService,ExcelService],
})
export class ResponsesModule {}
