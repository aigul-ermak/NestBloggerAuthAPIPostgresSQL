import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { applyAppSettings } from '../../src/settings/apply.app.setting';
import request from 'supertest';
import { UsersQueryRepository } from '../../src/features/user/repositories/users-query.repository';
import { createUser } from '../helpers/create-user.helper';
import { testConfig } from '../setup';

const HTTP_BASIC_USER = process.env.HTTP_BASIC_USER as string;
const HTTP_BASIC_PASS = process.env.HTTP_BASIC_PASS as string;

const basicAuthUsername = testConfig().basicAuthSettings.BASIC_AUTH_USERNAME;
const basicAuthPassword = testConfig().basicAuthSettings.BASIC_AUTH_PASSWORD;

const getBasicAuthHeader = (username: string, password: string) => {
  const base64Credentials = Buffer.from(`${username}:${password}`).toString(
    'base64',
  );
  return `Basic ${base64Credentials}`;
};

describe('Security testing', () => {
  let app: INestApplication;
  let httpServer;
  let usersQueryRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAppSettings(app);
    await app.init();

    usersQueryRepository =
      moduleFixture.get<UsersQueryRepository>(UsersQueryRepository);

    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await request(httpServer).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET -> "/security/devices": should return 200 with all active devices', async () => {
    const userDto = {
      login: 'user',
      password: 'password',
      email: 'example@example.com',
    };

    // Create a user
    const newUserBody = await createUser(
      app,
      userDto,
      basicAuthUsername,
      basicAuthPassword,
    );
    expect(newUserBody.status).toBe(201);

    // Login the user to create a session
    const loginUser = await request(httpServer)
      .post(`/auth/login`)
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send({
        loginOrEmail: newUserBody.body.login,
        password: userDto.password,
      })
      .expect(200);

    const user = await usersQueryRepository.findOneByEmail(userDto.email);

    console.log('user for id ', user.id);

    const cookie = loginUser.headers['set-cookie'];
    console.log('cookie', cookie);

    const response = await request(httpServer)
      .get(`/security/devices`)
      .set('Cookie', cookie)
      .send({})
      .expect(200);
    console.log('response', response.body);

    expect(response.body).toEqual([
      expect.objectContaining({
        id: expect.any(Number),
        userId: expect.any(Number),
        deviceId: expect.any(String),
        ip: expect.any(String),
        title: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    ]);
  });
});
