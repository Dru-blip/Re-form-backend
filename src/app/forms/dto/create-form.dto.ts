import { ApiProperty } from "@nestjs/swagger"

export class CreateFormDto {
    @ApiProperty()
    title:string

    @ApiProperty()
    description:string
}
