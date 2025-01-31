import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { applyAppSettings } from '../../src/settings/apply.app.setting';
import request from 'supertest';
import { UsersQueryRepository } from '../../src/features/user/repositories/users-query.repository';
import { createUser } from '../helpers/create-user.helper';
import { testConfig } from '../setup';
import { SessionQueryRepository } from '../../src/features/session/repositories/session-query.repository';

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
  let sessionQueryRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAppSettings(app);
    await app.init();

    usersQueryRepository =
      moduleFixture.get<UsersQueryRepository>(UsersQueryRepository);

    sessionQueryRepository = moduleFixture.get<SessionQueryRepository>(
      SessionQueryRepository,
    );

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

    const cookie = loginUser.headers['set-cookie'];

    const response = await request(httpServer)
      .get(`/security/devices`)
      .set('Cookie', cookie)
      .send({})
      .expect(200);

    expect(response.body).toEqual([
      expect.objectContaining({
        deviceId: expect.any(String),
        ip: expect.any(String),
        title: expect.any(String),
        lastActiveDate: expect.any(String),
      }),
    ]);
  });

  it('GET -> "/security/devices": should return 401 unautOhorized', async () => {
    const cookie =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzA5MmVmZDkwMDM4N2NmNGFmODlkMmMiLCJkZXZpY2VJZCI6IjlmNjI2MGFjLWRmMzEtNDdiNi05YTBmLWJjNzFiNjRjMGJhOCIsInVzZXJJUCI6InRlc3R1c2VyaXAiLCJ1c2VyQWdlbnQiOiJ1c2VyLWFnZW50IiwiaWF0IjoxNzI4NjU1MTAxLCJleHAiOjE3Mjg2NTUxMjF9.bfaoQP6pSUgjtfmhQGU48h-QL2GWZjgsy6tpl8qjQS9';

    const response = await request(httpServer)
      .get(`/security/devices`)
      .set('Cookie', cookie)
      .send({})
      .expect(401);

    expect(response.body).toEqual({
      error: 'Unauthorized',
      message: 'No refresh token found',
      statusCode: 401,
    });
  });

  it('DELETE -> "/security/devices/{deviceid}": should return 204 when deleting own device session', async () => {
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

    const cookie = loginUser.headers['set-cookie'];
    const session = await request(httpServer)
      .get(`/security/devices`)
      .set('Cookie', cookie)
      .send({})
      .expect(200);

    const deviceId = session.body[0].deviceId;
    console.log('deviceID', deviceId);

    const res = await request(httpServer)
      .delete(`/security/devices/${deviceId}`)
      .set('Cookie', cookie)
      .expect(204);
  });

  it('DELETE -> "/security/devices/{deviceID}": should return 401 when if auth credentials are incorrect', async () => {
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

    const cookie = loginUser.headers['set-cookie'];

    const deviceId = '0b047ab0-9fa8-458e-8dfb-3363d1eafbf7';

    const res = await request(httpServer)
      .delete(`/security/devices/${deviceId}`)
      .set('Cookie', cookie)
      .expect(401);

    expect(res.body).toEqual({
      error: 'Unauthorized',
      message: 'No refresh token found',
      statusCode: 401,
    });
  });
});
