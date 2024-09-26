import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import PrismaService from '../database/database.service';
import { QuestionsService } from '../questions/questions.service';

@Module({
  controllers: [ResponsesController],
  providers: [ResponsesService,PrismaService,QuestionsService],
})
export class ResponsesModule {}
