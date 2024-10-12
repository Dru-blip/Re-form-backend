import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import PrismaService from '../database/database.service';

@Injectable()
export class OptionsService {
  constructor(private readonly db: PrismaService) {}

  /**
   * Creates a new option in the database with the given data.
   *
   * @param questionId - The ID of the question that the option belongs to.
   * @param createOptionDto - The data to be used to create the option.
   * @returns The created option.
   */
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

  /**
   * Updates an option with the given id.
   *
   * @param id - The id of the option to update.
   * @param updateOptionDto - The details of the option to update.
   * @returns The updated option.
   */
  async update(id: string, updateOptionDto: UpdateOptionDto) {
    return await this.db.option.update({
      where: {
        id,
      },
      data: {...updateOptionDto},
    });
  }

  /**
   * Deletes an option with the given id.
   *
   * @param id - The id of the option to delete.
   * @returns The deleted option.
   */
  async remove(id: string) {
    return await this.db.option.delete({
      where: {
        id,
      },
    });
  }
}
