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

  /**
   * Creates a nodemailer transport instance on module initialization.
   * The transport is configured for use with Gmail's SMTP server.
   * The user and password are retrieved from environment variables.
   */
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
  /**
   * Destroys the nodemailer transport instance on module destruction.
   * This prevents memory leaks and allows the module to be garbage collected.
   */
  onModuleDestroy() {
    if (this.transport) {
      this.transport.close();
    }
  }

  /**
   * Sends an email using Gmail's SMTP server.
   *
   * @param {string} to The recipient's email address.
   * @param {string} content The content of the email. This should be a string containing HTML.
   * @param {string} subject The subject of the email.
   * @return {Promise<SentMessageInfo>} A promise that resolves to information about the sent message.
   */
  async sendEmail(to: string, content: string, subject: string): Promise<SentMessageInfo> {
    const mailOptions: Mail.Options = {
      from: this.config.get('GMAIL_NAME'),
      to,
      subject,
      html: content,
    };
    
    return await this.transport.sendMail(mailOptions);
  }
}
