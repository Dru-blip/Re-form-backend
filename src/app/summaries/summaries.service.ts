import { Injectable } from '@nestjs/common';
import PrismaService from '../database/database.service';
import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class SummariesService {
  constructor(
    private readonly db: PrismaService,
    private readonly questionService: QuestionsService,
  ) {}

  async findOne(id: string) {
    const questions = await this.db.question.findMany({
      where: {
        formId: id,
      },
      orderBy:{
        order:"asc"
      },
      include: {
        options: {
          select: {
            text:true,
            id:true,
            _count: {
              select: {
                answers: true,
              },
            },
          },
        },
      },
    });
    return questions;
  }
}
