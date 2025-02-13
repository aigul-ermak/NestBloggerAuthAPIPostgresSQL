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
    console.log('result count by blog', result.rows[0].count);
    return parseInt(result.rows[0].count, 10);
  }

  // async findPostsByBlogIdPaginated(
  //   blogId: number,
  //   sort: string,
  //   sortDirection: 'asc' | 'desc',
  //   page: number,
  //   pageSize: number,
  // ) {
  //   console.log('blogId', blogId);
  //   console.log('sort', sort);
  //   console.log('sortDirection', sortDirection);
  //   console.log('page', page);
  //   console.log('pageSize', pageSize);
  //
  //   const validPage = Math.max(page, 1);
  //   const skip = (validPage - 1) * pageSize;
  //
  //   const allowedSortFields = ['created_at', 'title'];
  //   const orderBy = allowedSortFields.includes(sort) ? sort : 'created_at';

  // const query = `
  //   SELECT * FROM posts
  //   WHERE blog_id = $1
  //   ORDER BY ${orderBy} ${sortDirection.toLowerCase()}
  //   LIMIT $2 OFFSET $3;
  // `;

  //   const query = `
  //     SELECT * FROM posts
  //     WHERE blog_id = 342
  //     ORDER BY 'created_at'
  //     LIMIT 3 OFFSET 15;
  //   `;
  //
  //   //const params = [blogId, +pageSize, skip];
  //   //console.log('params', params);
  //   const result = await this.pool.query(query);
  //   //const result = await this.pool.query(query, params);
  //   console.log('result', result.rows);
  //   return result.rows;
  // }

  async findPostsByBlogIdPaginated(
    blogId: number,
    sort: string,
    sortDirection: 'asc' | 'desc',
    page: number,
    pageSize: number,
  ) {
    const validColumns = ['created_at', 'title', 'content'];
    const sortColumn = validColumns.includes(sort) ? sort : 'created_at';

    // Validate pagination parameters
    const validPage = Math.max(1, page);
    const validPageSize = Math.max(1, Math.min(100, pageSize));
    const offset = (validPage - 1) * validPageSize;

    const query = `
      SELECT 
        p.id,
        p.title,
        p.short_description,
        p.content,
        p.blog_id,
        p.created_at,
        p.likes_count,
        dislikes_count,        
        b.name as "blogName"
      FROM posts p
      LEFT JOIN blogs b ON p.blog_id = b.id
      WHERE p.blog_id = $1    
      ORDER BY p.${sortColumn} ${sortDirection.toUpperCase()}  
      LIMIT $2 OFFSET $3 
    `;

    const result = await this.pool.query(query, [
      blogId,
      validPageSize,
      offset,
    ]);

    console.log('Query results:', {
      blogId,
      sortColumn,
      sortDirection,
      offset,
      pageSize: validPageSize,
      rowCount: result.rowCount,
    });

    return result.rows;
  }
}
