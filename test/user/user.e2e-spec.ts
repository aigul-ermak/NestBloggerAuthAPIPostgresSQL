import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { applyAppSettings } from '../../src/settings/apply.app.setting';
// import * as request from 'supertest';

const request = require('supertest');

const HTTP_BASIC_USER = process.env.HTTP_BASIC_USER as string;
const HTTP_BASIC_PASS = process.env.HTTP_BASIC_PASS as string;

const getBasicAuthHeader = (username: string, password: string) => {
  const base64Credentials = Buffer.from(`${username}:${password}`).toString(
    'base64',
  );
  return `Basic ${base64Credentials}`;
};

describe('Users testing', () => {
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

  afterAll(async () => {
    await request(httpServer).delete('/testing/all-data').expect(204);

    await app.close();
  });

  it('/users Create user', async () => {
    const userDto = {
      login: 'testuser',
      password: 'testpassword',
      email: 'testuser@example.com',
    };

    const response = await request(httpServer)
      .post('/sa/users')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(userDto)
      .expect(201);

    const newUser = response.body;

    const expectedUser = {
      login: userDto.login,
      email: userDto.email,
      id: expect.any(Number),
      createdAt: expect.any(String),
    };

    expect(newUser).toMatchObject(expectedUser);
  });
});
