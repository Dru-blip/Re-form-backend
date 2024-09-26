import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

// Data Transfer Object For User Login with validation
export class UserLoginDto {
    // Apply decorators for validation
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string

    @ApiProperty()
    @IsNotEmpty({message:"Password is required"})
    password: string
}