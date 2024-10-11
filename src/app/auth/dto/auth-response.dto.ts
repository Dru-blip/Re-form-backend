import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";




export class AuthResponse{
    @ApiProperty()
    accessToken:string;


    @ApiProperty()
    name:string

    @ApiProperty()
    email:string
}