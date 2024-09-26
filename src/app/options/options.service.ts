import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import PrismaService from '../database/database.service';

@Injectable()
export class OptionsService {
  constructor(private readonly db: PrismaService) {}

  async create(questionId: string, createOptionDto: CreateOptionDto) {
    return await this.db.option.create({
      data: {
        ...createOptionDto,
        questionId,
      },
    });
  }

  findAll() {
    return `This action returns all options`;
  }

  findOne(id: string) {
    return `This action returns a #${id} option`;
  }

  async update(id: string, updateOptionDto: UpdateOptionDto) {
    return await this.db.option.update({
      where: {
        id,
      },
      data: {...updateOptionDto},
    });
  }

  async remove(id: string) {
    return await this.db.option.delete({
      where: {
        id,
      },
    });
  }
}
