import { Module } from '@nestjs/common';
import { SummariesService } from './summaries.service';
import { SummariesController } from './summaries.controller';
import PrismaService from '../database/database.service';
import { QuestionsService } from '../questions/questions.service';

@Module({
  controllers: [SummariesController],
  providers: [SummariesService,PrismaService,QuestionsService],
})
export class SummariesModule {}
