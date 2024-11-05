import { Module } from '@nestjs/common';
import { AppController } from './settings/app.controller';
import { AppService } from './settings/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './features/user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './features/user/user.module';
import configuration, { ConfigurationType } from './settings/configuration';
import { TestingAllDataModule } from './features/testing-all-data/testing-all-data.module';
import { PostModule } from './features/post/post.module';
import { Post } from './features/post/entities/post.entity';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigurationType, true>) => {
        const environmentSettings = configService.get('environmentSettings', {
          infer: true,
        });

        console.log(
          'app-environmentSettings',
          configService.get('environmentSettings'),
        );

        const databaseSettings = configService.get('databaseSettings', {
          infer: true,
        });

        const uri = environmentSettings.isTesting
          ? databaseSettings.DATABASE_TEST_URL
          : databaseSettings.DATABASE_URL;

        //TODO delete
        console.log(`Chosen Database URI: ${uri}`);
        console.log(`Environment is Testing: ${environmentSettings.isTesting}`);

        return {
          type: 'postgres',
          url: uri,
          entities: [User, Post],
          synchronize: true,
        };
      },
    }),
    UserModule,
    TestingAllDataModule,
    PostModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
