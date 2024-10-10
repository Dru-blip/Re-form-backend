import { Injectable } from '@nestjs/common';
import PrismaService from '../database/database.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import {
  IndividualResponseResult,
  ResponseWithAnswersAndOptions,
  ResponsWithAnswersAndForm,
} from './types';

@Injectable()
export class ResponsesService {
  constructor(private readonly db: PrismaService) {}

  /**
   * Creates a new response in the database with the given data.
   *
   * @param createResponseDto - The data to be used to create the response.
   * @returns The created response.
   */
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

  /**
   * Finds all responses for a given form id.
   *
   * @param formId - The id of the form.
   * @returns An array of responses with their answers and options.
   */
  async findAll(formId: string) {
    return await this.db.response.findMany({
      where: {
        formId,
      },
      include: {
        answers: {
          include: {
            question: {
              select: {
                type: true,
              },
            },
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

  /**
   * Gets a page of individual responses with their answers and options.
   *
   * @param skip - The number of responses to skip.
   * @param take - The number of responses to take.
   * @param formId - The id of the form.
   * @returns An object with the total count of responses and the page of responses.
   */
  async getIndividual(
    skip: number,
    take: number,
    formId: string,
  ): Promise<IndividualResponseResult> {
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

  /**
   * Finds a response by id.
   *
   * @param id - The id of the response to find.
   * @returns The response with its form and answers, including the questions and options.
   */
  async find(id: string): Promise<ResponsWithAnswersAndForm> {
    return await this.db.response.findFirst({
      where: {
        id,
      },
      include: {
        form: true,
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

  async removeAll(formId: string) {
    return await this.db.response.deleteMany({
      where: {
        formId,
      },
    });
  }

  async remove(id: string) {
    return `This action removes a #${id} response`;
  }
}
