import { Injectable } from '@nestjs/common';
import { Form } from '@prisma/client';
import PrismaService from '../database/database.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

@Injectable()
export class FormsService {
  constructor(private readonly db: PrismaService) {}

  /**
   * Creates a new form  with the given details.
   *
   * @param formDetails - The details of the form to be created.
   * @param userId - The id of the user creating the form.
   * @returns The created form.
   */
  async create(formDetails: CreateFormDto, userId: string): Promise<Form> {
    const form = await this.db.form.create({
      data: {
        title: formDetails.title,
        description: formDetails.description,
        userId,
      },
    });
    
    // create a form setting with default values
    await this.db.setting.create({
      data: {
        formId: form.id,
      },
    });
    return form;
  }

  /**
   * Finds all forms for the given user id.
   *
   * @param userId - The id of the user.
   * @returns An array of forms.
   */
  async findAll(userId: string) {
    return await this.db.form.findMany({
      where: {
        userId,
      },
    });
  }

  /**
   * Finds a form by its id and includes its settings.
   *
   * @param id - The id of the form to find.
   * @returns The form with its settings.
   */
  async findOne(id: string) {
    return await this.db.form.findFirst({
      where: {
        id,
      },
      include: {
        settings: true,
      },
    });
  }

  /**
   * Updates a form with the given id.
   *
   * @param id - The id of the form to update.
   * @param updateFormDto - The details of the form to update.
   * @returns The updated form.
   */
  async update(id: string, updateFormDto: UpdateFormDto) {
    return `This action updates a #${id} form`;
  }

  /**
   * Deletes a form with the given id.
   *
   * @param id - The id of the form to delete.
   * @returns The deleted form.
   */
  async remove(id: string) {
    return this.db.form.delete({ where: { id } });
  }
}
