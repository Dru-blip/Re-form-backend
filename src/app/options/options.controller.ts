import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller(':queId/options')
@ApiTags('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  /**
   * Creates a new option in the database with the given data.
   *
   * @param questionId - The ID of the question that the option belongs to.
   * @param createOptionDto - The data to be used to create the option.
   * @returns The created option.
   */
  @Post()
  async create(
    @Param('queId') questionId: string,
    @Body() createOptionDto: CreateOptionDto,
  ) {
    return this.optionsService.create(questionId, createOptionDto);
  }

  /**
   * Finds all options in the database.
   *
   * @returns An array of all options.
   */
  @Get()
  findAll() {
    return this.optionsService.findAll();
  }

  /**
   * Finds an option by its id.
   *
   * @param id - The id of the option to find.
   * @returns The option with the given id.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.optionsService.findOne(id);
  }

  /**
   * Updates an option with the given id.
   *
   * @param id - The id of the option to update.
   * @param updateOptionDto - The details of the option to update.
   * @returns The updated option.
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOptionDto: UpdateOptionDto,
  ) {
    return await this.optionsService.update(id, updateOptionDto);
  }

  /**
   * Deletes an option with the given id.
   *
   * @param id - The id of the option to delete.
   * @returns The deleted option.
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.optionsService.remove(id);
  }
}
