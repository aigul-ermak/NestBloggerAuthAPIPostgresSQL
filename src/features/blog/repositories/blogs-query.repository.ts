import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class BlogsQueryRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async getBlogById(id: number) {
    const query = `SELECT * FROM blogs WHERE id = $1;`;
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) return null;

    return result.rows[0];
  }

  async findAllBlogsByFilter(
    filter: Partial<{ name: string }>,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    skip: number,
    limit: number,
  ) {
    const whereConditions: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (filter.name) {
      whereConditions.push(`name ILIKE $${index}`);
      values.push(`%${filter.name}%`);
      index++;
    }

    const sortableTextColumns = ['name', 'description'];
    const orderByClause = sortableTextColumns.includes(sortBy)
      ? `${sortBy} COLLATE "C"`
      : sortBy;

    const query = `
    SELECT * FROM blogs
    ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
    ORDER BY ${orderByClause} ${sortDirection} 
    LIMIT $${index} OFFSET $${index + 1};
    `;

    values.push(limit, skip);

    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async countDocuments(filter: Partial<{ name: string }>): Promise<number> {
    const whereConditions: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (filter.name) {
      whereConditions.push(`LOWER(name) ILIKE $${index}`);
      values.push(`%${filter.name.toLowerCase()}%`);
      index++;
    }

    const query = `
      SELECT COUNT(*) FROM blogs
      ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''};
    `;

    const result = await this.pool.query(query, values);
    return Number(result.rows[0].count);
  }
}
