import { ConfigModule } from '@nestjs/config';

export const testConfig = () => ({
  basicAuthSettings: {
    BASIC_AUTH_USERNAME: 'admin',
    BASIC_AUTH_PASSWORD: 'qwerty',
  },
});

export const TestConfigModule = ConfigModule.forRoot({
  load: [testConfig],
  isGlobal: true,
});
