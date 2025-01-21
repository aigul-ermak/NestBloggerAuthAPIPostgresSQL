import { User } from '../entities/user.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  }

  async deleteById(id: number): Promise<boolean> {
    const query = `DELETE FROM users WHERE id = $1;`;
    const result = await this.pool.query(query, [id]);

    if (result.rowCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return true;
  }

  async updateUserCode(userId: number, newCode: string): Promise<boolean> {
    const query = `UPDATE users SET confirmation_code = $2 WHERE id = $1`;

    const values = [userId, newCode];

    const result = await this.pool.query(query, values);

    return result.rowCount > 0;
  }
}
