import { HttpException, HttpStatus } from "@nestjs/common";



// Exception Class for User Already Exists
export class UserAlreadyExistException extends HttpException {
    constructor(){
        super('User with email already exists', HttpStatus.BAD_REQUEST);
    }
}