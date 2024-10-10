import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import PrismaService from '../database/database.service';
import { ConfigService } from '@nestjs/config';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailsService implements OnModuleInit, OnModuleDestroy {
  private transport: Transporter<SentMessageInfo, Options>;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.transport = createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: this.config.get('GMAIL_NAME'),
        pass: this.config.get('GMAIL_PASSWORD'),
      },
    });
  }
  onModuleDestroy() {
    if (this.transport) {
      this.transport.close();
    }
  }

  async sendEmail(to: string, content: string, subject: string) {
    const mailOptions: Mail.Options = {
      from: this.config.get('GMAIL_NAME'),
      to,
      subject,
      html: content,
    };
    
    return await this.transport.sendMail(mailOptions);
  }
}
