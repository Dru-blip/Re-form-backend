import { Injectable } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import PrismaService from '../database/database.service';
import { Response } from '@prisma/client';

@Injectable()
export class ResponsesService {
  constructor(private readonly db: PrismaService) {}
  async create(createResponseDto: CreateResponseDto) {
    let newResponse = await this.db.response.create({
      data: {
        formId: createResponseDto.formId,
      },
    });

    const queries = [];
    for (const answer of createResponseDto.answers) {
      queries.push(
        this.db.answer.create({
          data: {
            formId: createResponseDto.formId,
            responseId: newResponse.id,
            optionIds: answer.optionIds,
            text: answer.text,
            questionId: answer.questionId,
          },
        }),
      );
    }
    await this.db.$transaction(queries);
    return newResponse;
  }

  async findAll(formId: string) {
    return await this.db.response.findMany({
      where: {
        formId,
      },
      include: {
        answers: {
          include: {
            options: {
              select: {
                text: true,
              },
            },
          },
        },
      },
    });
  }

  async getIndividual(skip: number, take: number, formId: string) {
    const countQuery = this.db.response.count({
      where: {
        formId,
      },
    });
    const responseQuery = this.db.response.findFirst({
      where: {
        formId,
      },
      include: {
        answers: {
          include: {
            question: {
              include: {
                options: true,
              },
            },
            options: true,
          },
        },
      },
      skip,
      take,
      orderBy: {
        submittedDate: 'asc',
      },
    });

    const [count, response] = await this.db.$transaction([
      countQuery,
      responseQuery,
    ]);

    return { count, response };
  }

  async find(id: string) {
    return await this.db.response.findFirst({
      where: {
        id,
      },
      include: {
        form:true,
        answers: {
          include: {
            question: {
              include: {
                options: true,
              },
            },
            options: true,
          },
        },
      },
      orderBy: {
        submittedDate: 'asc',
      },
    });
  }

  async update(id: string, updateResponseDto: UpdateResponseDto) {
    return `This action updates a #${id} response`;
  }

  async remove(id: string) {
    return `This action removes a #${id} response`;
  }
}
