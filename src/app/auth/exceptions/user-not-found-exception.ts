import { HttpException, HttpStatus } from "@nestjs/common";




// Exception Class for User Not Found
export class UserNotFoundException extends HttpException {
    constructor(){
        super('User not found', HttpStatus.NOT_FOUND);
    }
}