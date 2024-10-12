import { Injectable, OnModuleInit } from '@nestjs/common';
import PrismaService from '../database/database.service';
import { EmailsService } from '../emails/emails.service';
import { authenticator } from 'otplib';
import { addMinutes, addSeconds } from 'date-fns';
import { EmailOTP } from '@prisma/client';

@Injectable()
export class OtpsService {
  private secret: string;
  /**
   * The constructor for the OtpsService class.
   *
   * This constructor takes a PrismaService instance as its only argument and
   * uses it to initialize the service.
   *
   * @param {PrismaService} db - The PrismaService instance to use.
   */
  constructor(private readonly db: PrismaService) {
    authenticator.options = {
      digits: 6,
    };
    this.secret = authenticator.generateSecret();
  }

  /**
   * Generates a new OTP with the secret stored in the service.
   *
   * @return {string} The generated OTP.
   */
  generateOTP(): string {
    return authenticator.generate(this.secret);
  }

  /**
   * Finds a single OTP by its id.
   *
   * @param {string} id - The id of the OTP to find.
   * @return {Promise<EmailOTP | null>} The OTP with the specified id, or null if no OTP was found.
   */
  async findOne(id: string): Promise<EmailOTP | null> {
    return await this.db.emailOTP.findFirst({
      where: {
        id,
      },
    });
  }

  /**
   * Generates a new OTP with the secret stored in the service, and saves it in the database with the given email.
   *
   * @param {string} email - The email address to associate the OTP with.
   * @return {Promise<EmailOTP>} The newly created OTP.
   */
  async generateAndSaveOTP(email: string): Promise<EmailOTP> {
    const code = authenticator.generate(this.secret);

    return await this.db.emailOTP.create({
      data: {
        code,
        expiresIn: addMinutes(Date.now(), 10),
        email,
      },
    });
  }

  /**
   * Updates the OTP with the given id to mark it as verified.
   *
   * @param {string} id - The id of the OTP to update.
   * @return {Promise<EmailOTP>} The updated OTP.
   */
  async makeOTPVerified(id: string): Promise<EmailOTP> {
    return await this.db.emailOTP.update({
      where: {
        id,
      },
      data: {
        verified: true,
      },
    });
  }

  /**
   * Deletes all OTPs with the given email.
   *
   * @param {string} email - The email address to delete OTPs for.
   * @return {Promise<BatchPayload>} The result of the deletion.
   */
  async deleteMany(email: string): Promise<unknown> {
    return await this.db.emailOTP.deleteMany({
      where: {
        email,
      },
    });
  }
}
