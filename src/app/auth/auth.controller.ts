import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { EmailsService } from '../emails/emails.service';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AuthResponse } from './dto/auth-response.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { PasswordUpdateDTO } from './dto/password-update.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

// Controller Class For User Authentication
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailsService,
  ) {}

  /**
   * Handles user login by authenticating user credentials and returning an access token.
   * @param {UserLoginDto} body - The user's login credentials.
   * @return {Promise<AuthResponse>} A promise that resolves to an object containing the access token.
   */

  @ApiOperation({ summary: 'login' })
  @Post('login')
  // Mark http status code as ok
  @HttpCode(HttpStatus.OK)
  // Mark function as public
  @Public()
  async login(@Body() body: UserLoginDto): Promise<AuthResponse> {
    return await this.authService.authenticateUser(body);
  }

  /**
   * Handles user registration by creating a new user account.
   *
   * @param {UserRegisterDto} body - The user's registration details.
   * @return {Promise<User>} A promise that resolves to the newly registered user.
   */
  @ApiOperation({ summary: 'register' })
  @Post('register')
  // Mark http status code as ok
  @HttpCode(HttpStatus.OK)
  // Mark function as public
  @Public()
  // interceptor to remove password from response
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() body: UserRegisterDto): Promise<AuthResponse> {
    return await this.authService.registerUser(body);
  }

  @Post('forgotPassword')
  @Public()
  /**
   * Handles forgot password request.
   *
   * @param {ForgotPasswordDTO} body - Email address of the user.
   * @return {Promise<{ id: string, sent: boolean, msg: string }>} A promise that resolves to an object with two properties: id and sent.
   *         If sent is true, then the id refers to the OTP ID and the msg is a success message. If sent is false, then the id is null and the msg is an error message.
   */
  async forgotPassword(
    @Body() body: ForgotPasswordDTO,
  ): Promise<{ id: string; sent: boolean; msg: string } | {}> {
    //send email containing otp
    return await this.authService.forgotPassword(body);
  }

  @Post('updatePassword')
  @Public()
  /**
   * Updates the password for a user with the provided email and OTP.
   *
   * @param {PasswordUpdateDTO} body - The request body with the email, OTP ID and new password.
   * @return {Promise<{ message: string, error: any }>} The response object with two properties: message and error.
   *         If the password is successfully updated, then the message is "success" and the error is null.
   *         If the OTP is not verified, then the message is "otp not verified" and the error is null.
   *         If the user is not found, then the message is null and the error is a HttpException with status code 404.
   */
  async udpatePassword(@Body() body: PasswordUpdateDTO) {
    return await this.authService.updatePassword(body);
  }
}
