import { Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import PrismaService from '../database/database.service';
import { Form, Setting } from '@prisma/client';

@Injectable()
export class FormsService {
  constructor(private readonly db: PrismaService) {}

  async create(formDetails: CreateFormDto, userId: string): Promise<Form> {
    const form = await this.db.form.create({
      data: {
        title: formDetails.title,
        description: formDetails.description,
        userId,
      },
    });
    const formSettings = await this.db.setting.create({
      data: {
        formId: form.id,
      },
    });
    return form;
  }

  async findAll(userId: string) {
    return await this.db.form.findMany({
      where: {
        userId,
      },
    });
  }

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

  async update(id: string, updateFormDto: UpdateFormDto) {
    return `This action updates a #${id} form`;
  }

  async remove(id: string) {
    return this.db.form.delete({ where: { id } });
  }
}
