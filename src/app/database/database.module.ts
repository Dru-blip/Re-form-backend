import { createClient } from '@libsql/client/.';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {drizzle, LibSQLDatabase} from "drizzle-orm/libsql"
import { DATABASE } from 'src/constants';

// Module For Managing and Connecting Databases
@Module({
  imports: [],
  providers: [{
    provide:DATABASE,
    useFactory:async(configService:ConfigService)=>{
      const databaseUrl=configService.get<string>("DATABASE_FILE")
      const client=createClient({url:databaseUrl})
      
      return drizzle(client)
    },
    inject:[ConfigService]
  }],
  exports: [DATABASE],
})
export class DatabaseModule {}

