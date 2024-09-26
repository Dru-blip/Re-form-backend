import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionReorderDTO } from './dto/question-reorder.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('questions')
@Controller(':formId/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async create(
    @Param('formId') formId: string,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return await this.questionsService.create(formId, createQuestionDto);
  }

  @Get()
  @Public()
  async findAll(@Param('formId') formId: string) {
    return await this.questionsService.findAll(formId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.questionsService.findOne(id);
  }

  @Patch('reorder')
  async updateOrder(@Body() reorderQuestionDTO: QuestionReorderDTO) {
    return await this.questionsService.updateOrder(
      reorderQuestionDTO.q1,
      reorderQuestionDTO.q2,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return await this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}
