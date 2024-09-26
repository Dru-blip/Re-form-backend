import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { Request } from 'express';
import { QuestionsService } from '../questions/questions.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';


@ApiTags("responses")
@Controller(':formId/responses')
export class ResponsesController {
  constructor(
    private readonly responsesService: ResponsesService,
    private readonly questionService: QuestionsService,
  ) {}

  @Post()
  @Public()
  async create(
    @Req() req: Request,
    @Body() createResponseDto: CreateResponseDto,
  ) {
    return await this.responsesService.create(createResponseDto);
  }

  @Get()
  async findAll(@Param('formId') formId: string) {
    const responses = await this.responsesService.findAll(formId);
    const questions = await this.questionService.findAll(formId);
    return { questions, responses };
  }


  @Get('individual')
  async getIndividual(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
    @Param('formId') formId: string,
  ) {
    return this.responsesService.getIndividual(skip,take,formId);
  }

  @Get(":id")
  @Public()
  async findOne(@Param("id") id:string){
    return await this.responsesService.find(id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateResponseDto: UpdateResponseDto,
  ) {
    return this.responsesService.update(id, updateResponseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.responsesService.remove(id);
  }
}
