import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from './settings/configuration';
import { applyAppSettings } from '@app/settings/apply.app.setting';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyAppSettings(app);

  const configService =
    app.get<ConfigService<ConfigurationType>>(ConfigService);
  const apiSettings = configService.get('apiSettings');
  const port = apiSettings?.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
