import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { applyAppSettings } from '../../src/settings/apply.app.setting';
import request from 'supertest';
import { createUser } from '../helpers/create-user.helper';

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

  it('POST -> "/auth/registration": should return error if email already exist; status 400', async () => {
    const userRegistrationDtoFirst = {
      login: 'userD',
      password: 'password',
      email: 'example@example.com',
    };

    const userRegistrationDtoSecond = {
      login: 'userSecond',
      password: 'password',
      email: 'example@example.com',
    };

    const response1 = await request(httpServer)
      .post('/auth/registration')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(userRegistrationDtoFirst)
      .expect(204);

    const response = await request(httpServer)
      .post('/auth/registration')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(userRegistrationDtoSecond)
      .expect(400);

    const expectedResult = {
      errorsMessages: [
        {
          message: 'User with this email already exists',
          field: 'email',
        },
      ],
    };
    console.error('expectedResult', expectedResult);
    expect(response.body).toEqual(expectedResult);
  });

  it('POST -> "/auth/registration": should return error if login already exist; status 400', async () => {
    const userRegistrationDtoFirst = {
      login: 'user',
      password: 'password',
      email: 'example1@example.com',
    };

    const userRegistrationDtoSecond = {
      login: 'user',
      password: 'password',
      email: 'example2@example.com',
    };

    const response1 = await request(httpServer)
      .post('/auth/registration')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(userRegistrationDtoFirst)
      .expect(204);

    const response = await request(httpServer)
      .post('/auth/registration')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(userRegistrationDtoSecond)
      .expect(400);

    const expectedResult = {
      errorsMessages: [
        {
          message: 'User with this login already exists',
          field: 'login',
        },
      ],
    };

    expect(response.body).toEqual(expectedResult);
  });

  // it('POST -> auth/login: should return 200 for login user', async () => {
  //   const newUserDto = {
  //     login: 'user1',
  //     password: 'password',
  //     email: 'example1@example.com',
  //   };
  //
  //   const newUserResponse = await createUser(
  //     app,
  //     newUserDto,
  //     HTTP_BASIC_USER,
  //     HTTP_BASIC_PASS,
  //   );
  //
  //   expect(newUserResponse.status).toBe(201);
  //
  //   const response = await request(httpServer)
  //     .post(`/auth/login`)
  //     .set(
  //       'Authorization',
  //       getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
  //     )
  //     .send({
  //       loginOrEmail: newUserDto.login,
  //       password: newUserDto.password,
  //     })
  //     .expect(200);
  //
  //   const accessToken = response.body;
  //
  //   const expectedResult = {
  //     accessToken: expect.any(String),
  //   };
  //
  //   expect(response.body).toEqual(expectedResult);
  // });
});
