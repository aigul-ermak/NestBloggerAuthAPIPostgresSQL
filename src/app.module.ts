import { Module } from '@nestjs/common';
import { AppController } from './settings/app.controller';
import { AppService } from './settings/app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './features/user/user.module';
import configuration from './settings/configuration';
import { TestingAllDataModule } from './features/testing-all-data/testing-all-data.module';
import { PostModule } from './features/post/post.module';
import { AuthModule } from './features/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailModule } from './features/email/email.module';
import { SessionModule } from './features/session/session.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 10,
        limit: 5,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    UserModule,
    TestingAllDataModule,
    PostModule,
    AuthModule,
    EmailModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
