import { Controller, Get, Param } from '@nestjs/common';
import { SummariesService } from './summaries.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags("summaries")
@Controller(':formId/summaries')
export class SummariesController {

  constructor(private readonly summariesService: SummariesService) {}

  @Get()
  findOne(@Param('formId') id: string) {
    return this.summariesService.findOne(id);
  }
}
