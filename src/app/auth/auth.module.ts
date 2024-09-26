import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import PrismaService from 'src/app/database/database.service';
import { UsersService } from 'src/app/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


// Module For User Authentication
@Module({
  imports: [
    // Load JwtModule for jwt authentication
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // JWT Options
        signOptions: {
          // Token Expiration Time
          expiresIn: '5h',
        },
        // Load Secret key required to encode and decode tokens
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  // Load AuthController
  controllers: [AuthController],
  // Mark AuthService as a provider and import UsersService from Users Module
  providers: [AuthService, UsersService,PrismaService],
})
export class AuthModule {}
