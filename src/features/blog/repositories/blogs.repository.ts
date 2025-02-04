import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class BlogsRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async createBlog(name, description, websiteUrl) {
    const query = `
      INSERT INTO blogs (name, description, websiteUrl) 
      VALUES ($1, $2, $3) 
      RETURNING id;
    `;
    const result = await this.pool.query(query, [
      name,
      description,
      websiteUrl,
    ]);
    return result.rows[0].id;
  }
}
