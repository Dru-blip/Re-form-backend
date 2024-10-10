import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors
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
   * @return {Promise<{accessToken:string}>} A promise that resolves to an object containing the access token.
   */

  @ApiOperation({ summary: 'login' })
  @Post('login')
  // Mark http status code as ok
  @HttpCode(HttpStatus.OK)
  // Mark function as public
  @Public()
  async login(@Body() body: UserLoginDto): Promise<{ accessToken: string }> {
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
  async forgotPassword(@Body() body: ForgotPasswordDTO) {
    //send email containing otp
    return await this.authService.forgotPassword(body);
  }

  @Post("updatePassword")
  @Public()
  async udpatePassword(@Body() body:PasswordUpdateDTO) {
    return await this.authService.updatePassword(body)
  }
}
