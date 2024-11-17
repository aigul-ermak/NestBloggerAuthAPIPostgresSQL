const request = require('supertest');
import { INestApplication } from '@nestjs/common';

const getBasicAuthHeader = (username: string, password: string) => {
  const base64Credentials = Buffer.from(`${username}:${password}`).toString(
    'base64',
  );
  return `Basic ${base64Credentials}`;
};

export const createAllUsers = async (
  app: INestApplication,
  usersData: Array<{ login: string; password: string; email: string }>,
  username: string,
  password: string,
) => {
  const createdUsers = [];

  for (const userDto of usersData) {
    const response = await request(app.getHttpServer())
      .post('/sa/users')
      .set('Authorization', getBasicAuthHeader(username, password))
      .send(userDto);

    if (response.status !== 201) {
      console.error(`Failed to create user: ${userDto.login}`, response.body);
    }

    expect(response.status).toBe(201);
    createdUsers.push(response.body);
  }

  return createdUsers;
};
