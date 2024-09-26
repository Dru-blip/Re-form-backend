import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@Controller('forms')
@ApiTags("forms")
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  async create(@Req() req:Request,@Body() createFormDto: CreateFormDto) {
    return await this.formsService.create(createFormDto,req.user.id);
  }

  @Get()
  async findAll(@Req() req:Request) {
    return await this.formsService.findAll(req.user.id);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return await this.formsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return await this.formsService.update(id, updateFormDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.formsService.remove(id);
  }
}
