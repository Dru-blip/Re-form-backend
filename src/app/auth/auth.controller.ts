import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Public } from './decorators/public.decorator';
import { AuthResponse } from './dto/auth-response.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

// Controller Class For User Authentication
@ApiTags("auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles user login by authenticating user credentials and returning an access token.
   * @param {UserLoginDto} body - The user's login credentials.
   * @return {Promise<{accessToken:string}>} A promise that resolves to an object containing the access token.
   */

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
}
