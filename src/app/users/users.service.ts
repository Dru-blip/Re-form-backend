import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRegisterDto } from 'src/app/auth/dto/user-register.dto';
import PrismaService from 'src/app/database/database.service';

// Service Class For Users
@Injectable()
export class UsersService {
  /**
   * Constructs a new instance of the UsersService class.
   */
  constructor(private readonly db: PrismaService) {}

  /**
   * Creates a new user with the provided details.
   *
   * @param {UserRegisterDto} userDetails - The details of the user to be created.
   * @return {Promise<User>} A Promise that resolves to the newly created user.
   */
  async createUser(userDetails: UserRegisterDto): Promise<User> {
    return await this.db.user.create({
      data: {
        name: userDetails.name,
        email: userDetails.email,
        password: userDetails.password,
      },
    });
  }

  /**
   * Finds a user by their email address.
   *
   * @param {string} email - The email address of the user to find.
   * @return {Promise<User | null>} A Promise that resolves to the user with the specified email address, or null if no such user exists.
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.db.user.findUnique({
      where: {
        email,
      },
    });
  }
}
