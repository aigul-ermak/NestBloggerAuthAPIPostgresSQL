import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { applyAppSettings } from '../../src/settings/apply.app.setting';
import { createUser } from '../helpers/create-user.helper';
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

  afterEach(async () => {
    await request(httpServer).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST -> /sa/users: 201 add new user to the system', async () => {
    const userDto = {
      login: 'testuser',
      password: 'testpassword',
      email: 'testuser@example.com',
    };

    const newUserResponse = await createUser(
      app,
      userDto,
      HTTP_BASIC_USER,
      HTTP_BASIC_PASS,
    );
    expect(newUserResponse.status).toBe(201);

    const expectedUser = {
      login: userDto.login,
      email: userDto.email,
      id: expect.any(String),
      createdAt: expect.stringMatching(
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
      ),
    };

    expect(newUserResponse.body).toMatchObject(expectedUser);
  });

  it('POST -> /sa/users: 401 add new user to the system, incorrect values', async () => {
    const userDto = {
      login: '',
      password: '',
      email: '',
    };

    const newUserResponse = await createUser(
      app,
      userDto,
      HTTP_BASIC_USER,
      HTTP_BASIC_PASS,
    );

    expect(newUserResponse.status).toBe(400);

    const expectedResult = {
      errorsMessages: [
        { message: 'Length not correct', field: 'login' },
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

    expect(newUserResponse.body).toEqual(expectedResult);
  });

  it('POST -> /sa/users: 401 add new user to the system, unauthorized', async () => {
    const userDto = {
      login: 'testuser',
      password: 'testpassword',
      email: 'testuser@example.com',
    };

    const response = await request(httpServer)
      .post('/sa/users')
      .send(userDto)
      .expect(401);

    expect(response.body).toEqual({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('GET -> /sa/users: 200 return all users', async () => {
    const userDto = {
      login: 'testuser1',
      password: 'testpassword',
      email: 'testuser1@example.com',
    };

    const newUserResponse = await createUser(
      app,
      userDto,
      HTTP_BASIC_USER,
      HTTP_BASIC_PASS,
    );
    expect(newUserResponse.status).toBe(201);

    const response = await request(httpServer)
      .get('/sa/users')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .expect(200);

    const expectedResponse = {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [
        {
          id: expect.any(String),
          login: expect.any(String),
          email: expect.any(String),
          createdAt: expect.any(String),
        },
      ],
    };
    expect(response.body).toEqual(expectedResponse);
  });

  it('GET -> /sa/users: 401 return all users, unauthorized', async () => {
    const userDto = {
      login: 'testuser',
      password: 'testpassword',
      email: 'testuser@example.com',
    };

    const newUserResponse = await createUser(
      app,
      userDto,
      HTTP_BASIC_USER,
      HTTP_BASIC_PASS,
    );
    expect(newUserResponse.status).toBe(201);

    const response = await request(httpServer).get('/sa/users').expect(401);

    expect(response.body).toEqual({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });
});
