import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { applyAppSettings } from '../../src/settings/apply.app.setting';
import request from 'supertest';
import { testConfig } from '../setup';
import { BlogsQueryRepository } from '../../src/features/blog/repositories/blogs-query.repository';

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

    blogsQueryRepository =
      moduleFixture.get<BlogsQueryRepository>(BlogsQueryRepository);

    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await request(httpServer).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST -> "/sa/blogs": should return 201 for create blog', async () => {
    const blogDto = {
      name: 'testBlog',
      description: 'testDescription',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    const response = await request(httpServer)
      .post('/sa/blogs')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(blogDto)
      .expect(201);

    const expectedResult = {
      id: expect.any(String),
      name: blogDto.name,
      description: expect.any(String),
      websiteUrl: expect.any(String),
      createdAt: expect.any(String),
      isMembership: false,
    };

    let blog = response.body;

    expect(response.body).toEqual(expectedResult);
  });

  it('POST -> "/sa/blogs": should return 400 for invalid blog fields', async () => {
    const blogDto = {
      name: '',
      description: '',
      websiteUrl: '',
    };

    const response = await request(httpServer)
      .post('/sa/blogs')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(blogDto)
      .expect(400);

    const expectedResult = {
      errorsMessages: [
        {
          message: 'Length not correct',
          field: 'name',
        },
        {
          message: 'Description not correct',
          field: 'description',
        },
        {
          message: 'Invalid URL format. The URL must start with https://',
          field: 'websiteUrl',
        },
      ],
    };

    expect(response.body).toEqual(expectedResult);
  });

  it('POST -> "/sa/blogs": should return 401 for Unauthorized', async () => {
    const blogDto = {
      name: 'testBlog',
      description: 'testDescription',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    const response = await request(httpServer)
      .post('/sa/blogs')
      .send(blogDto)
      .expect(401);

    expect(response.body).toEqual({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('GET -> "/sa/blogs": return 200 for get blog', async () => {
    const blogDto = {
      name: 'testBlog',
      description: 'testDescription',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    const res = await request(httpServer)
      .post('/sa/blogs')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(blogDto)
      .expect(201);

    const blogId = +res.body.id;

    console.log('blogID', blogId);

    const response = await request(httpServer)
      .get(`/blogs/${blogId}`)
      .expect(200);

    const expectedResult = {
      id: expect.any(String),
      name: blogDto.name,
      description: expect.any(String),
      websiteUrl: expect.any(String),
      createdAt: expect.any(String),
      isMembership: false,
    };

    expect(response.body).toEqual(expectedResult);
  });

  it('GET -> "/sa/blogs": returns 404 for not found blog', async () => {
    const blogId = 105258;

    const response = await request(httpServer)
      .get(`/blogs/${blogId}`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Blog not found',
      error: 'Not Found',
    });
  });

  it('PUT -> "/sa/blogs": return 204 for update blog', async () => {
    const blogDto = {
      name: 'testBlog',
      description: 'testDescription',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    const res = await request(httpServer)
      .post('/sa/blogs')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(blogDto)
      .expect(201);

    const blogId = +res.body.id;
    console.log('blogId', blogId);
    const blogUpdateDto = {
      name: 'testNewBlog',
      description: 'testNewDescription',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    const response = await request(httpServer)
      .put(`/sa/blogs/${blogId}`)
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(blogUpdateDto)
      .expect(204);
  });

  it('PUT -> "/sa/blogs": return 400 for update blog', async () => {
    const blogDto = {
      name: 'testBlog',
      description: 'testDescription',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    const res = await request(httpServer)
      .post('/sa/blogs')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(blogDto)
      .expect(201);

    const blogId = +res.body.id;
    console.log('blogId', blogId);
    const blogUpdateDto = {
      name: '',
      description: '',
      websiteUrl: '',
    };

    const response = await request(httpServer)
      .put(`/sa/blogs/${blogId}`)
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(blogUpdateDto)
      .expect(400);

    const expectedResult = {
      errorsMessages: [
        {
          message: 'Length not correct',
          field: 'name',
        },
        {
          message: 'Description not correct',
          field: 'description',
        },
        {
          message: 'Url not correct',
          field: 'websiteUrl',
        },
      ],
    };

    expect(response.body).toEqual(expectedResult);
  });

  it('PUT -> "/sa/blogs": return 401 for update blog', async () => {
    const blogDto = {
      name: 'testBlog',
      description: 'testDescription',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    const res = await request(httpServer)
      .post('/sa/blogs')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(blogDto)
      .expect(201);

    const blogId = +res.body.id;
    console.log('blogId', blogId);
    const blogUpdateDto = {
      name: 'testNewBlog',
      description: 'testNewDescription',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    const response = await request(httpServer)
      .put(`/sa/blogs/${blogId}`)
      .send(blogUpdateDto)
      .expect(401);

    expect(response.body).toEqual({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('PUT -> "/sa/blogs": return 404 for update blog', async () => {
    const blogId = 100500;

    const blogUpdateDto = {
      name: 'testNewBlog',
      description: 'testNewDescription',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    const response = await request(httpServer)
      .put(`/sa/blogs/${blogId}`)
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(blogUpdateDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Blog not found',
      error: 'Not Found',
    });
  });

  it('DELETE -> "/sa/blogs": return 204', async () => {
    const blogDto = {
      name: 'testBlog',
      description: 'testDescription',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    const res = await request(httpServer)
      .post('/sa/blogs')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(blogDto)
      .expect(201);

    const blogId = +res.body.id;
    console.log('blogId', blogId);
    const blogUpdateDto = {
      name: 'testNewBlog',
      description: 'testNewDescription',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    const response = await request(httpServer)
      .delete(`/sa/blogs/${blogId}`)
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(blogUpdateDto)
      .expect(204);
  });

  it('DELETE -> "/sa/blogs": return 401', async () => {
    const blogDto = {
      name: 'testBlog',
      description: 'testDescription',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    const res = await request(httpServer)
      .post('/sa/blogs')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(blogDto)
      .expect(201);

    const blogId = +res.body.id;
    console.log('blogId', blogId);
    const blogUpdateDto = {
      name: 'testNewBlog',
      description: 'testNewDescription',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    const response = await request(httpServer)
      .delete(`/sa/blogs/${blogId}`)
      .send(blogUpdateDto)
      .expect(401);

    expect(response.body).toEqual({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('DELETE -> "/sa/blogs": return 404', async () => {
    const blogId = 100500;

    const blogUpdateDto = {
      name: 'testNewBlog',
      description: 'testNewDescription',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    const response = await request(httpServer)
      .delete(`/sa/blogs/${blogId}`)
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(blogUpdateDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Blog not found',
      error: 'Not Found',
    });
  });

  it('GET -> "/sa/blogs": returns 200 for get all blogs', async () => {
    const blogDto1 = {
      name: 'testBlog1',
      description: 'testDescription1',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    await request(httpServer)
      .post('/sa/blogs')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(blogDto1)
      .expect(201);

    const blogDto2 = {
      name: 'testBlog2',
      description: 'testDescription2',
      websiteUrl:
        'https://hEO9ArXY2EqnGG_jmMb9Yi8zRBjLabLGWMR9e.yiKejrxeCGMhNvmCqzmaOm_Fv_jf.5ahBsb1mXVdXbyt9KYo8l907V',
    };

    await request(httpServer)
      .post('/sa/blogs')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .send(blogDto2)
      .expect(201);

    const response = await request(httpServer)
      .get('/sa/blogs')
      .set(
        'Authorization',
        getBasicAuthHeader(HTTP_BASIC_USER, HTTP_BASIC_PASS),
      )
      .expect(200);

    console.log(response.body);
    const expectedResponse = {
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [
        {
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          websiteUrl: expect.any(String),
          createdAt: expect.any(String),
          isMembership: false,
        },
        {
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          websiteUrl: expect.any(String),
          createdAt: expect.any(String),
          isMembership: false,
        },
      ],
    };

    expect(response.body).toEqual(expectedResponse);
  });
});
