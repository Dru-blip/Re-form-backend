import { ApiProperty } from "@nestjs/swagger"
import { Option, QuestionType } from "@prisma/client"


export class CreateQuestionDto {
    @ApiProperty({required:false})
    text?:string
    @ApiProperty({required:false})
    type?:QuestionType
    @ApiProperty({required:false})
    order?:number
    @ApiProperty()
    isRequired:boolean
}
