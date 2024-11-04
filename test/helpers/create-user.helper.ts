const request = require('supertest');
import { INestApplication } from '@nestjs/common';

const getBasicAuthHeader = (username: string, password: string) => {
  const base64Credentials = Buffer.from(`${username}:${password}`).toString(
    'base64',
  );
  return `Basic ${base64Credentials}`;
};

export const createUser = async (
  app: INestApplication,
  userDto: { login: string; password: string; email: string },
  username: string,
  password: string,
) => {
  const response = await request(app.getHttpServer())
    .post('/sa/users')
    .set('Authorization', getBasicAuthHeader(username, password))
    .send(userDto);

  return response;
};
