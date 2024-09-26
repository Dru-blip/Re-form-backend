import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller(':queId/options')
@ApiTags("options")
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) { }

  @Post()
  async create(@Param("queId") questionId: string, @Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.create(questionId, createOptionDto);
  }

  @Get()
  findAll() {
    return this.optionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.optionsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOptionDto: UpdateOptionDto) {
    return await this.optionsService.update(id, updateOptionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.optionsService.remove(id);
  }
}
