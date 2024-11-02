import {Module} from '@nestjs/common';
import {AppController} from './settings/app.controller';
import {AppService} from './settings/app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './user/entities/user.entity';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {UserModule} from './user/user.module';
import configuration from './settings/configuration';
import { TestingAllDataModule } from './testing-all-data/testing-all-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [User],
        synchronize: true,
      }),
    }),
    UserModule,
    TestingAllDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
