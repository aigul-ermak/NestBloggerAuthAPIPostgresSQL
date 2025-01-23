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

describe('Auth testing', () => {
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

  it('POST -> "/auth/registration-email-resending": should resend email confirmation and return 204', async () => {
    const userRegistrationDto = {
      login: 'user',
      password: 'password',
      email: 'example1@example.com',
    };

    // register the user
    await request(httpServer)
      .post('/auth/registration')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(userRegistrationDto)
      .expect(204);

    const response = await request(httpServer)
      .post('/auth/registration-email-resending')
      .send({ email: userRegistrationDto.email })
      .expect(204);

    expect(response.text).toEqual('');
  });

  it('POST -> "/auth/registration-email-resending": should return 400 if email does not exist', async () => {
    const userRegistrationDto = {
      login: 'user',
      password: 'password',
      email: 'example@example.com',
    };

    // register the user
    await request(httpServer)
      .post('/auth/registration')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(userRegistrationDto)
      .expect(204);

    const response = await request(httpServer)
      .post('/auth/registration-email-resending')
      .send({ email: 'examplWrong@example.com' })
      .expect(400);

    const expectedResult = {
      errorsMessages: [
        {
          message: 'Email does not exist',
          field: 'email',
        },
      ],
    };

    expect(response.body).toEqual(expectedResult);
  });

  it('POST -> "/auth/registration-email-resending": should return 400 if email is already confirmed', async () => {
    const userRegistrationDto = {
      login: 'user',
      password: 'password',
      email: 'example@example.com',
    };

    // register the user
    await request(httpServer)
      .post('/auth/registration')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(userRegistrationDto)
      .expect(204);

    const response = await request(httpServer)
      .post('/auth/registration-email-resending')
      .send({ email: 'examplWrong@example.com' })
      .expect(400);

    const expectedResult = {
      errorsMessages: [
        {
          message: 'Email does not exist',
          field: 'email',
        },
      ],
    };

    expect(response.body).toEqual(expectedResult);
  });

  it('POST -> "/auth/registration-confirmation": should verify the email, activate the account, and return a 204', async () => {
    const userRegistrationDto = {
      login: 'user',
      password: 'password',
      email: 'example1@example.com',
    };

    // register the user
    await request(httpServer)
      .post('/auth/registration')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(userRegistrationDto)
      .expect(204);

    // sent confirmation code
    await request(httpServer)
      .post('/auth/registration-email-resending')
      .send({ email: userRegistrationDto.email })
      .expect(204);

    const user = await usersQueryRepository.findOneByEmail(
      userRegistrationDto.email,
    );

    const confirmationCode = user.confirmationCode;

    const response = await request(httpServer)
      .post('/auth/registration-confirmation')
      .send({ code: confirmationCode })
      .expect(204);

    expect(response.text).toEqual('');

    const updatedUser = await usersQueryRepository.findOneByEmail(
      userRegistrationDto.email,
    );
    expect(updatedUser.isConfirmed).toBe(true);
  });

  it('POST -> "/auth/registration-confirmation": should return a 400 confirmation code is incorrect', async () => {
    const userRegistrationDto = {
      login: 'user',
      password: 'password',
      email: 'example1@example.com',
    };

    // register the user
    await request(httpServer)
      .post('/auth/registration')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(userRegistrationDto)
      .expect(204);

    // sent confirmation code
    await request(httpServer)
      .post('/auth/registration-email-resending')
      .send({ email: userRegistrationDto.email })
      .expect(204);

    // const user = await usersQueryRepository.findOneByEmail(
    //   userRegistrationDto.email,
    // );

    const confirmationCode = '77e4f27e-0d78-4140-b7ef-f3d64cb4da7a';

    const response = await request(httpServer)
      .post('/auth/registration-confirmation')
      .send({ code: confirmationCode })
      .expect(400);

    const expectedResult = {
      errorsMessages: [
        {
          message: 'Confirmation code does not exist',
          field: 'code',
        },
      ],
    };

    expect(response.body).toEqual(expectedResult);
  });

  it('GET -> "/auth/me": should return 200: user data received', async () => {
    const userDto = {
      login: 'testuser',
      password: 'testpassword',
      email: 'testuser@example.com',
    };

    const newUserResponse = await createUser(
      app,
      userDto,
      basicAuthUsername,
      basicAuthPassword,
    );
    expect(newUserResponse.status).toBe(201);

    const currentUserLoginDto = {
      loginOrEmail: 'testuser@example.com',
      password: 'testpassword',
    };

    const loginUser = await request(httpServer)
      .post(`/auth/login`)
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(currentUserLoginDto)
      .expect(200);

    const accessToken = loginUser.body.accessToken;

    const response = await request(httpServer)
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const expectedResult = {
      email: userDto.email,
      login: userDto.login,
      userId: expect.any(String),
    };

    expect(response.body).toEqual(expectedResult);
  });

  it('GET -> "/auth/me": should return 401: user unauthorized', async () => {
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbk9yRW1haWwiOiJhaWcyIiwiaWQiOiI2NzA5M2ExNzk4YjEwY2NhZDE4OTEwMjkiLCJpYXQiOjE3Mjg2NTc5NDUsImV4cCI6MTcyODY1Nzk1NX0.B4lKhZD2XuzKjhUMX5CBicMT0lm_59VtkH5rKDMlf9U';

    const response = await request(httpServer)
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(401);
  });
});
