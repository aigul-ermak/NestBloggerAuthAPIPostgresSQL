import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from './settings/configuration';
import { applyAppSettings } from './settings/apply.app.setting';
import { Pool } from 'pg';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const pool = app.get<Pool>('DATABASE_POOL');
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database Connected:', res.rows);
  } catch (error) {
    console.error('Database Connection Failed:', error);
  }

  applyAppSettings(app);

  const configService =
    app.get<ConfigService<ConfigurationType>>(ConfigService);
  const apiSettings = configService.get('apiSettings');
  const port = apiSettings?.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
