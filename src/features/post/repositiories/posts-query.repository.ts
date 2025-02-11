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

  async countByBlogId(blogId: number) {
    const query = `SELECT COUNT(*) FROM posts WHERE blog_id = $1;`;
    const result = await this.pool.query(query, [blogId]);

    return parseInt(result.rows[0].count, 10);
  }

  async findPostsByBlogIdPaginated(
    blogId: number,
    sort: string,
    sortDirection: 'asc' | 'desc',
    page: number,
    pageSize: number,
  ) {
    const validPage = Math.max(page, 1);
    const offset = (validPage - 1) * pageSize;

    const allowedSortFields = ['created_at', 'title'];
    const orderBy = allowedSortFields.includes(sort) ? sort : 'created_at';

    const query = `
    SELECT * FROM posts 
    WHERE blog_id = $1 
    ORDER BY ${orderBy} ${sortDirection.toUpperCase()} 
    LIMIT $2 OFFSET $3;
  `;

    const result = await this.pool.query(query, [blogId, pageSize, offset]);

    return result.rows;
  }
}
