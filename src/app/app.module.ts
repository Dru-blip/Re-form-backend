import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FormsModule } from './forms/forms.module';
import { SettingsModule } from './settings/settings.module';
import { QuestionsModule } from './questions/questions.module';
import { OptionsModule } from './options/options.module';
import { ResponsesModule } from './responses/responses.module';
import { SummariesModule } from './summaries/summaries.module';
import { EmailsModule } from './emails/emails.module';
import { OtpsModule } from './otps/otps.module';


/**
 * Root module for application.
 *
 * @module AppModule
 */
@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot(),
    // Load database module
    DatabaseModule,
    // Load other modules
    UsersModule,
    AuthModule,
    FormsModule,
    SettingsModule,
    QuestionsModule,
    OptionsModule,
    ResponsesModule,
    SummariesModule,
    EmailsModule,
    OtpsModule,
  ],
})
export class AppModule {}
