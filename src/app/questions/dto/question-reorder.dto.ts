import { ApiProperty } from "@nestjs/swagger";
import { Question } from "@prisma/client";



export class QuestionReorderDTO{
    @ApiProperty({name:"question 1"})
    q1:Question
    @ApiProperty({name:"question 2"})
    q2:Question
}