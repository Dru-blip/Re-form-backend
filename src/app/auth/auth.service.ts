import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import { EmailsService } from '../emails/emails.service';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { OtpsService } from '../otps/otps.service';
import { PasswordUpdateDTO } from './dto/password-update.dto';
import { error } from 'console';

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
    private readonly emailService: EmailsService,
    private readonly otpService: OtpsService,
  ) {}

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

      return { id: user.id, name: user.name, email: user.email };
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
    if (
      !(await PasswordService.comparePassword(
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


  /**
   * Updates the password for a user with the provided email and OTP.
   *
   * @param {PasswordUpdateDTO} body - The request body with the email, OTP ID and new password.
   * @return {Promise<{ message: string, error: any }>} The response object with two properties: message and error.
   *         If the password is successfully updated, then the message is "success" and the error is null.
   *         If the OTP is not verified, then the message is "otp not verified" and the error is null.
   *         If the user is not found, then the message is null and the error is a HttpException with status code 404.
   */
  async updatePassword(body: PasswordUpdateDTO) {
    const user = await this.userService.findUserByEmail(body.email);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const otp = await this.otpService.findOne(body.otpId);
    if (otp && otp.verified) {
      const hashedPassword = await PasswordService.hashPassword(
        body.newPassword,
      );
      let udpatedUser: User = { ...user, password: hashedPassword };
      udpatedUser = await this.userService.updateUser(user.id, udpatedUser);
      await this.otpService.deleteMany(udpatedUser.email);
      return { message: 'success', error: null };
    } else {
      return { message: 'otp not verified' };
    }
  }

  /**
   * Handles forgot password request.
   *
   * @param {ForgotPasswordDTO} data - Email address of the user.
   * @return {Promise<{ id: string, sent: boolean, msg: string }>}
   *         The response object with two properties: id and sent.
   *         If sent is true, then the id refers to the OTP ID and
   *         the msg is a success message. If sent is false, then
   *         the id is null and the msg is an error message.
   */
  async forgotPassword(data: ForgotPasswordDTO) {
    const user = await this.userService.findUserByEmail(data.email);
    if (!user) {
      return {};
    }
    const otp = await this.otpService.generateAndSaveOTP(data.email);
    const content = `
     <div>
      <b>${otp.code}</b> <br/>
      <p>code expires in ${otp.expiresIn}</p>
      </div>
    `;
    const response = await this.emailService.sendEmail(
      user.email,
      content,
      'Password Reset',
    );
    if (response.accepted.at(0) === user.email) {
      return { id: otp.id, sent: true, msg: 'code successfully sent' };
    } else {
      return { sent: false, msg: 'failed to send otp' };
    }
  }
}
