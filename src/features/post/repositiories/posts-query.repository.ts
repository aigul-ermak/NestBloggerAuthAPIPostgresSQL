import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PostsQueryRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async getPostById(id: number) {
    const query = `SELECT * FROM posts WHERE id = $1;`;
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) return null;

    return result.rows[0];
  }
}
