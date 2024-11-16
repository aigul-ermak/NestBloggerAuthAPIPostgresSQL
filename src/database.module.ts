import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: (configService: ConfigService) => {
        const environmentSettings = configService.get('environmentSettings');
        const databaseSettings = configService.get('databaseSettings');

        const uri = environmentSettings.isTesting
          ? databaseSettings.DATABASE_TEST_URL
          : databaseSettings.DATABASE_URL;

        //TODO delete later
        console.log('Database uri', uri);

        return new Pool({
          connectionString: uri,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule {}
