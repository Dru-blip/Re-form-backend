import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/app/users/users.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { PasswordService } from './password.service';
import { UserAlreadyExistException } from './exceptions';
import { DatabaseErrorCodes } from 'src/app/database/codes';
import { UserLoginDto } from './dto/user-login.dto';
import { UserNotFoundException } from './exceptions/user-not-found-exception';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { AuthResponse } from './dto/auth-response.dto';

// Service Class For User Authentication
@Injectable()
export class AuthService {
  /**
   * Service class constructor.
   *
   * @param {JwtService} jwtService - The JwtService instance.
   * @param {UsersService} userService - The UsersService instance.
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) { }

  /**
   * Registers a new user with the provided user details.
   *
   * @param {UserRegisterDto} userDetails - The details of the user to be registered.
   * @return {Promise<User>} The created user.
   */
  async registerUser(userDetails: UserRegisterDto): Promise<AuthResponse> {
    // Error Handling for database constraints
    try {
      // Hashing User Password for security
      const hashedPassword = await PasswordService.hashPassword(
        userDetails.password,
      );
      // Save User Details to Database and return the created User
      const user = await this.userService.createUser({
        ...userDetails,
        password: hashedPassword,
      });

      return { id: user.id, name: user.name, email: user.email }
    } catch (err) {
      // User Email field  is unique constraint
      // Thowing Exception if Unique Constraint is violated
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === DatabaseErrorCodes.UNIQUE_VIOLATION) {
          throw new UserAlreadyExistException();
        }
      }
    }
  }

  /**
   * Authenticates a user with the provided login details.
   *
   * @param {UserLoginDto} userLoginDetails - The details of the user to be authenticated.
   * @return {Promise<{ accessToken: string }>} The JWT access token for the authenticated user.
   */
  async authenticateUser(userLoginDetails: UserLoginDto) {
    // Find User given by Email
    const user = await this.userService.findUserByEmail(userLoginDetails.email);
    // Check If User Exists or Not
    // If User Does Not Exist Throw UserNotFoundException
    if (!user) {
      throw new UserNotFoundException();
    }

    // Check If Password Matches or Not
    if (!(await PasswordService.comparePassword(
      userLoginDetails.password,
      user.password,
    ))
    ) {
      // If Password Does Not Match Throw Wrong Password Exception
      throw new HttpException('Wrong Password', HttpStatus.UNAUTHORIZED);
    }

    // If User Exists and Password Matches Generate JWT Token with user_id as payload
    const token = await this.jwtService.signAsync(
      { id: user.id },
      { secret: process.env.JWT_SECRET },
    );

    // Return JWT Token
    return {
      accessToken: token,
    };
  }
}
