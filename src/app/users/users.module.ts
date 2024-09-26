import { Module } from '@nestjs/common';
import PrismaService from 'src/app/database/database.service';
import { UsersService } from './users.service';


// Module For Users 
@Module({
  // Import TypeOrmModule For User Entity
  imports: [],
  // Mark UsersService As A Provider
  providers: [UsersService,PrismaService],
})
export class UsersModule {}
