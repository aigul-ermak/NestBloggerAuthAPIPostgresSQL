import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { applyAppSettings } from '../../src/settings/apply.app.setting';
import { createUser } from '../helpers/create-user.helper';
import { isLogLevelEnabled } from '@nestjs/common/services/utils';
// import request from 'supertest';
const request = require('supertest');

const HTTP_BASIC_USER = process.env.HTTP_BASIC_USER as string;
const HTTP_BASIC_PASS = process.env.HTTP_BASIC_PASS as string;

const getBasicAuthHeader = (username: string, password: string) => {
  const base64Credentials = Buffer.from(`${username}:${password}`).toString(
    'base64',
  );
  return `Basic ${base64Credentials}`;
};

describe('Auth testing', () => {
  let app: INestApplication;
  let httpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAppSettings(app);
    await app.init();

    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await request(httpServer).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST -> "/auth/registration": should return 204: user registered', async () => {
    const userRegistrationDto = {
      login: 'user',
      password: 'password',
      email: 'example@example.com',
    };

    const registrationUser = await request(httpServer)
      .post(`/auth/registration`)
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(userRegistrationDto)
      .expect(204);
  });

  it('POST -> "/auth/registration": return 400 for user registration', async () => {
    const userRegistrationDto = {
      login: '',
      password: '',
      email: '',
    };

    const response = await request(httpServer)
      .post('/auth/registration')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(userRegistrationDto)
      .expect(400);

    const expectedResult = {
      errorsMessages: [
        {
          message: 'Length not correct',
          field: 'login',
        },
        {
          message: 'Length not correct',
          field: 'password',
        },
        {
          message: 'email must be an email',
          field: 'email',
        },
      ],
    };

    expect(response.body).toEqual(expectedResult);
  });
});