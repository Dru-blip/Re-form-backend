import { Injectable } from '@nestjs/common';
import PrismaService from '../database/database.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question, QuestionType } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(private readonly db: PrismaService) {}

  async create(formId: string, createQuestionDto: CreateQuestionDto) {
    return this.db.question.create({
      data: {
        isRequired: createQuestionDto.isRequired,
        order: createQuestionDto.order,
        formId,
      },
    });
  }

  async findAll(formId: string):Promise<Question[]> {
    return await this.db.question.findMany({
      where: {
        formId,
      },
      include: {
        options: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} question`;
  }

  async updateOrder(q1: UpdateQuestionDto, q2: UpdateQuestionDto) {
    const q1Update = this.db.question.update({
      where: {
        id: q1.id,
      },
      data: {
        order: q1.order,
      },
    });

    const q2Update = this.db.question.update({
      where: {
        id: q2.id,
      },
      data: {
        order: q2.order,
      },
    });

    return await this.db.$transaction([q1Update, q2Update]);
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    const data: Record<string, string | boolean | number> = {};
    if (updateQuestionDto.isRequired !== undefined) {
      data['isRequired'] = updateQuestionDto.isRequired;
    }
    if (updateQuestionDto.order !== undefined) {
      data['order'] = updateQuestionDto.order;
    }
    if (updateQuestionDto.text !== undefined) {
      data['text'] = updateQuestionDto.text;
    }
    if (updateQuestionDto.type !== undefined) {
      data['type'] = updateQuestionDto.type;
      if (
        updateQuestionDto.type !== QuestionType.CHECKBOX &&
        updateQuestionDto.type !== QuestionType.MULIT_CHOICE
      ) {
        await this.db.option.deleteMany({
          where: {
            questionId: id,
          },
        });
      }
    }

    return await this.db.question.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: string) {
    return await this.db.question.delete({
      where: {
        id,
      },
    });
  }
}
