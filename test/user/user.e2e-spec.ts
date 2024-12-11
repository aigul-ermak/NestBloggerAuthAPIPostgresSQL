import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { applyAppSettings } from '../../src/settings/apply.app.setting';
import { createUser } from '../helpers/create-user.helper';
import request from 'supertest';
import { testConfig, TestConfigModule } from '../setup';
import { createAllUsers } from '../helpers/create-allusers.helper';

const basicAuthUsername = testConfig().basicAuthSettings.BASIC_AUTH_USERNAME;
const basicAuthPassword = testConfig().basicAuthSettings.BASIC_AUTH_PASSWORD;

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
      imports: [AppModule, TestConfigModule],
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
      basicAuthUsername,
      basicAuthPassword,
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
      basicAuthUsername,
      basicAuthPassword,
    );

    expect(newUserResponse.status).toBe(400);

    const expectedResult = {
      errorsMessages: [
        {
          message: expect.any(String),
          field: 'login',
        },
        {
          message: expect.any(String),
          field: 'password',
        },
        {
          message: expect.any(String),
          field: 'email',
        },
      ],
    };
    console.error(expectedResult);
    expect(newUserResponse.body).toEqual(expectedResult);
  });

  it('POST -> "/sa/users": should return error if passed body is incorrect; status 400;', async () => {
    const userDto = {
      login: 'sh',
      password: 'length_21-weqweqweqwq',
      email: 'someemail@gg.com',
    };

    const newUserResponse = await createUser(
      app,
      userDto,
      basicAuthUsername,
      basicAuthPassword,
    );

    expect(newUserResponse.status).toBe(400);

    const expectedResult = {
      errorsMessages: [
        {
          message: expect.any(String),
          field: 'login',
        },
        {
          message: expect.any(String),
          field: 'password',
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

  // it('GET -> /sa/users: 200 return all users', async () => {
  //   const userDto = {
  //     login: 'testuser1',
  //     password: 'testpassword',
  //     email: 'testuser1@example.com',
  //   };
  //
  //   const newUserResponse = await createUser(
  //     app,
  //     userDto,
  //     basicAuthUsername,
  //     basicAuthPassword,
  //   );
  //   expect(newUserResponse.status).toBe(201);
  //
  //   const queryParams = {
  //     pageSize: 10,
  //     pageNumber: 1,
  //     sortDirection: 'desc',
  //     sortBy: 'created_at',
  //   };
  //
  //   const response = await request(httpServer)
  //     .get('/sa/users')
  //     .set(
  //       'Authorization',
  //       getBasicAuthHeader(basicAuthUsername, basicAuthPassword),
  //     )
  //     .query(queryParams)
  //     .expect(200);
  //
  //   console.error('here', response.body);
  //
  //   const expectedResponse = {
  //     pagesCount: 1,
  //     page: 1,
  //     pageSize: 10,
  //     totalCount: 1,
  //     items: [
  //       {
  //         id: expect.any(String),
  //         login: userDto.login,
  //         email: userDto.email,
  //         createdAt: expect.any(String),
  //       },
  //     ],
  //   };
  //
  //   expect(response.body).toEqual(expectedResponse);
  // });

  it('GET -> /sa/users: 200 return all users with pagination and sorting', async () => {
    const usersData = [
      { login: 'log01', password: 'password2', email: 'emai@gg.com' },
      { login: 'loSer', password: 'password1', email: 'email2p@gg.om' },
      { login: 'log02', password: 'password3', email: 'email2p@g.com' },
      { login: 'uer15', password: 'password4', email: 'emarrr1@gg.com' },
    ];

    const createdUsers = await createAllUsers(
      app,
      usersData,
      basicAuthUsername,
      basicAuthPassword,
    );

    expect(createdUsers).toHaveLength(usersData.length);

    const queryParams = {
      pageSize: 15,
      pageNumber: 1,
      searchLoginTerm: 'seR',
      searchEmailTerm: '.com',
      sortDirection: 'asc',
      sortBy: 'login',
    };

    const response = await request(app.getHttpServer())
      .get('/sa/users')
      .set(
        'Authorization',
        getBasicAuthHeader(basicAuthUsername, basicAuthPassword),
      )
      .query(queryParams)
      .expect(200);
    // TODO delete
    console.error(response.body);

    const expectedResponse = {
      pagesCount: 1,
      page: 1,
      pageSize: 15,
      totalCount: 4,
      items: [
        {
          id: expect.any(String),
          login: 'loSer',
          email: 'email2p@gg.om',
          createdAt: expect.any(String),
        },
        {
          id: expect.any(String),
          login: 'log01',
          email: 'emai@gg.com',
          createdAt: expect.any(String),
        },
        {
          id: expect.any(String),
          login: 'log02',
          email: 'email2p@g.com',
          createdAt: expect.any(String),
        },
        {
          id: expect.any(String),
          login: 'uer15',
          email: 'emarrr1@gg.com',
          createdAt: expect.any(String),
        },
      ],
    };
    expect(response.body).toEqual(expectedResponse);
  });

  // it('GET -> /sa/users: 401 return all users, unauthorized', async () => {
  //   const userDto = {
  //     login: 'testuser',
  //     password: 'testpassword',
  //     email: 'testuser@example.com',
  //   };
  //
  //   const newUserResponse = await createUser(
  //     app,
  //     userDto,
  //     basicAuthUsername,
  //     basicAuthPassword,
  //   );
  //   expect(newUserResponse.status).toBe(201);
  //
  //   const response = await request(httpServer).get('/sa/users').expect(401);
  //
  //   expect(response.body).toEqual({
  //     message: 'Unauthorized',
  //     statusCode: 401,
  //   });
  // });

  it('DELETE -> /sa/users: 204 add new user to the system, unauthorized', async () => {
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

    const response = await request(httpServer)
      .delete(`/sa/users/${newUserResponse.body.id}`)
      .set(
        'Authorization',
        getBasicAuthHeader(basicAuthUsername, basicAuthPassword),
      )
      .expect(204);
  });

  it('DELETE -> /sa/users: 401 delete user to the system, unauthorized', async () => {
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

    const response = await request(httpServer)
      .delete(`/sa/users/${newUserResponse.body.id}`)
      .expect(401);
  });

  it('DELETE -> /sa/users: 404 delete user to the system, If specified user is not exists', async () => {
    const response = await request(httpServer)
      .delete(`/sa/users/1000`)
      .set(
        'Authorization',
        getBasicAuthHeader(basicAuthUsername, basicAuthPassword),
      )
      .expect(404);
  });
});
