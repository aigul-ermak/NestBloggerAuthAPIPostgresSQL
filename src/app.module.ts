import { Module } from '@nestjs/common';
import { AppController } from './settings/app.controller';
import { AppService } from './settings/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database.module';
import { User } from './user/entities/user.entity';
import { config } from 'dotenv';

config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User],
      synchronize: true,
      logging: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
