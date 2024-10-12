import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@Controller('forms')
@ApiTags("forms")
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

    /**
   * Creates a new form and returns it
   * @param createFormDto the dto of the form to be created
   * @param req the express request
   * @returns the created form
   */
  @ApiOperation({summary:"create form",description:"creates a new form"})
  @Post()
  async create(@Req() req:Request,@Body() createFormDto: CreateFormDto) {
    return await this.formsService.create(createFormDto,req.user.id);
  }


  /**
   * Finds all forms for the given user id.
   * @param req the express request
   * @returns An array of forms.
   */
  @ApiOperation({summary:"Find All",description:"find all forms related to user"})
  @Get()
  async findAll(@Req() req:Request) {
    return await this.formsService.findAll(req.user.id);
  }


  /**
   * Finds a form by its id and includes its settings.
   * @param id The id of the form to find.
   * @returns The form with its settings.
   */
  @ApiOperation({summary:"Find One"})
  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return await this.formsService.findOne(id);
  }

  
  /**
   * Updates a form with the given id.
   * @param id The id of the form to update.
   * @param updateFormDto The details of the form to update.
   * @returns The updated form.
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return await this.formsService.update(id, updateFormDto);
  }

  /**
   * Deletes a form with the given id.
   * @param id The id of the form to delete.
   * @returns The deleted form.
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.formsService.remove(id);
  }
}
