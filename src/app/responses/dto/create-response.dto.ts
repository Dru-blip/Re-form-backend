import { ApiProperty } from "@nestjs/swagger"
import { Answer } from "@prisma/client"

export class CreateResponseDto {
    @ApiProperty()
    formId:string
    @ApiProperty()
    answers:Partial<Answer>[]
}
