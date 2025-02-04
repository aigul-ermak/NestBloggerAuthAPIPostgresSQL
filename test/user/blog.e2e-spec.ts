import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { applyAppSettings } from '../../src/settings/apply.app.setting';
import request from 'supertest';
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

describe('Blog testing', () => {
  let app: INestApplication;
  let httpServer;
  let blogsQueryRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAppSettings(app);
    await app.init();

    // blogsQueryRepository =
    //   moduleFixture.get<UsersQueryRepository>(UsersQueryRepository);

    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await request(httpServer).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    await app.close();
  });

  // it('POST -> "/sa/blogs": should return 201 for create blog', async () => {
  //   const blogDto = {
  //     name: 'testBlog',
  //     description: 'testDescription',
  //     websiteUrl:
  //       'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
  //   };
  //
  //   const response = await request(httpServer)
  //     .post('/sa/blogs')
  //     .set(
  //       'Authorization',
  //       getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
  //     )
  //     .send(blogDto)
  //     .expect(201);
  //
  //   const expectedResult = {
  //     id: expect.any(String),
  //     name: blogDto.name,
  //     description: expect.any(String),
  //     websiteUrl: expect.any(String),
  //     createdAt: expect.any(String),
  //     isMembership: false,
  //   };
  //
  //   let blog = response.body;
  //
  //   expect(response.body).toEqual(expectedResult);
  // });
  //
});
