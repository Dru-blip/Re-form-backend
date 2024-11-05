import { Injectable } from '@nestjs/common';
import { LibSQLDatabase } from 'drizzle-orm/libsql';

import { UserRegisterDto } from 'src/app/auth/dto/user-register.dto';


// Service Class For Users
@Injectable()
export class UsersService {
  /**
   * Constructs a new instance of the UsersService class.
   */
  constructor(private readonly db:LibSQLDatabase) {}

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

  async findById(id: string) {
    return await this.db.user.findFirst({
      where: {
        id,
      },
    });
  }

  async updateUser(id: string, user: Partial<User>) {
    return await this.db.user.update({
      where: {
        id,
      },
      data: {
        password:user.password
      },
    });
  }
}
