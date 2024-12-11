export type EnvironmentVariable = { [key: string]: string | undefined };

export type ConfigurationType = ReturnType<typeof getConfig>;

export enum Environments {
  PRODUCTION = 'PRODUCTION',
  STAGING = 'STAGING',
  TEST = 'TEST',
  DEVELOPMENT = 'DEVELOPMENT',
}

const getConfig = (
  environmentVariables: EnvironmentVariable,
  currentEnvironment: Environments,
) => {
  console.log(`Parsed Current Environment: ${currentEnvironment}`);

  return {
    apiSettings: {
      PORT: Number.parseInt(environmentVariables.PORT || '3000'),
      LOCAL_HOST: environmentVariables.LOCAL_HOST || 'http://localhost:3007',
      PUBLIC_FRIEND_FRONT_URL: environmentVariables.PUBLIC_FRIEND_FRONT_URL,
    },

    databaseSettings: {
      DATABASE_URL: environmentVariables.DATABASE_URL,
      DATABASE_TEST_URL: environmentVariables.DATABASE_TEST_URL,
    },

    environmentSettings: {
      currentEnv: currentEnvironment,
      isProduction: currentEnvironment === Environments.PRODUCTION,
      isStaging: currentEnvironment === Environments.STAGING,
      isTesting: currentEnvironment === Environments.TEST,
      isDevelopment: currentEnvironment === Environments.DEVELOPMENT,
    },

    emailSettings: {
      EMAIL_USER: environmentVariables.EMAIL_USER,
      EMAIL_PASS: environmentVariables.EMAIL_PASS,
    },

    basicAuthSettings: {
      BASIC_AUTH_USERNAME: environmentVariables.HTTP_BASIC_USER,
      BASIC_AUTH_PASSWORD: environmentVariables.HTTP_BASIC_PASS,
    },

    jwtSettings: {
      JWT_ACCESS_SECRET: environmentVariables.JWT_ACCESS_SECRET || '123',
      JWT_REFRESH_SECRET: environmentVariables.JWT_REFRESH_SECRET || '12345',
      ACCESS_TOKEN_EXPIRY: environmentVariables.ACCESS_TOKEN_EXPIRY || '10s',
      REFRESH_TOKEN_EXPIRY: environmentVariables.REFRESH_TOKEN_EXPIRY || '20s',
    },
  };
};

export default () => {
  const environmentVariables = process.env as unknown as EnvironmentVariable;

  const currentEnvironment: Environments = environmentVariables.NODE_ENV
    ? (environmentVariables.NODE_ENV.toUpperCase() as Environments)
    : Environments.DEVELOPMENT;

  

  return getConfig(environmentVariables, currentEnvironment);
};
