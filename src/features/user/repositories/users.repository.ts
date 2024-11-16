import { User } from '../entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UsersRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async create(user: Partial<User>): Promise<User> {
    const query = `
      INSERT INTO users (login, email, password_hash, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [user.login, user.email, user.passwordHash];

    const result = await this.pool.query(query, values);
    return result.rows[0];
    // const newUser = this.usersRepository.create(user);
    // return await this.usersRepository.save(newUser);
    // todo get raw sql only, post/put typeorm
    // return await this.dataSource.query(`INSERT INTO "user" VALUES ()`);
  }

  // async save(user: Partial<User>): Promise<User> {
  //   return await this.usersRepository.save(user);
  // }

  // async deleteById(id: string): Promise<boolean> {
  //   const result = await this.usersRepository.delete(id);
  //
  //   if (result.affected === 0) {
  //     throw new NotFoundException(`User with ID ${id} not found`);
  //   }
  //
  //   return true;
  // }
}
