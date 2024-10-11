import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Workbook } from 'exceljs';
import { Request } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { QuestionsService } from '../questions/questions.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { ExcelService } from './excel.service';
import { ResponsesService } from './responses.service';

@ApiTags('responses')
@Controller(':formId/responses')
export class ResponsesController {
  constructor(
    private readonly responsesService: ResponsesService,
    private readonly questionService: QuestionsService,
    private readonly excelService: ExcelService,
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

  @Get('download')
  @Header('Content-Disposition', 'attachment; filename="package.xlsx"')
  async downloadResponses(@Param('formId') formId: string, @Res() res: any) {
    const questions = await this.questionService.findAll(formId);
    const responses = await this.responsesService.findAll(formId);
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet('Responses');
    sheet.properties.defaultColWidth=30;
    sheet.properties.defaultRowHeight=15;
    
    const header = ['Timestamp'];

    questions.forEach((question) => {
      header.push(question.text);
    });

    this.excelService.writeHeaders(sheet, header);

    responses.forEach((response) => {
      const rowData: string[] = [response.submittedDate.toLocaleString()];
      response.answers.forEach((answer) => {
        if (answer.question.type === 'TEXT') {
          rowData.push(answer.text);
        } else {
          rowData.push(answer.options.map((option) => option.text).join(','));
        }
      });
      sheet.addRow(rowData);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    res.send(buffer);
  }

  @Get('individual')
  async getIndividual(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
    @Param('formId') formId: string,
  ) {
    return this.responsesService.getIndividual(skip, take, formId);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return await this.responsesService.find(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateResponseDto: UpdateResponseDto,
  ) {
    return this.responsesService.update(id, updateResponseDto);
  }

  @Delete()
  async removeALl(@Param('formId') formId: string) {
    return await this.responsesService.removeAll(formId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.responsesService.remove(id);
  }
}
