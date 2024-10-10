import { Injectable, OnModuleInit } from '@nestjs/common';
import PrismaService from '../database/database.service';
import { EmailsService } from '../emails/emails.service';
import { authenticator } from 'otplib';
import { addMinutes, addSeconds } from 'date-fns';

@Injectable()
export class OtpsService {
  private secret;
  constructor(private readonly db: PrismaService) {
    authenticator.options = {
      digits: 6,
    };
    this.secret = authenticator.generateSecret();
  }

  generateOTP() {
    return authenticator.generate(this.secret);
  }

  async findOne(id: string) {
    return await this.db.emailOTP.findFirst({
      where: {
        id,
      },
    });
  }

  async generateAndSaveOTP(email: string) {
    const code = authenticator.generate(this.secret);

    return await this.db.emailOTP.create({
      data: {
        code,
        expiresIn: addMinutes(Date.now(), 10),
        email,
      },
    });
  }

  async makeOTPVerified(id: string) {
    return await this.db.emailOTP.update({
      where: {
        id,
      },
      data: {
        verified: true,
      },
    });
  }

  async deleteMany(email: string) {
    return await this.db.emailOTP.deleteMany({
      where: {
        email,
      },
    });
  }
}
