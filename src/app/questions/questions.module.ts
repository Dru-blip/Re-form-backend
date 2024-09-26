import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import PrismaService from '../database/database.service';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService,PrismaService],
})
export class QuestionsModule {}
