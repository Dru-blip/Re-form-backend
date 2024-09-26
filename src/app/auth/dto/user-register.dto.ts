import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


// Data Transfer Object For User Register
export class UserRegisterDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name:string

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email:string

    @IsNotEmpty()
    @IsStrongPassword()
    @ApiProperty()
    password:string
}