import * as bcrypt from 'bcrypt';

// Utility Class For Password Hashing and Comparing
export class PasswordService {
  /**
   * Hashes a given password using the bcrypt library.
   *
   * @param {string} password - The password to be hashed.
   * @return {Promise<string>} A promise that resolves to the hashed password.
   */
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  /**
   * Compares a given password with a hashed password using the bcrypt library.
   *
   * @param {string} password - The password to compare.
   * @param {string} hashedPassword - The hashed password to compare against.
   * @return {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
   */
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
