import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { UpdateBlogDto } from '../dto/update-blog.dto';

@Injectable()
export class BlogsRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async createBlog(name, description, websiteUrl): Promise<Number> {
    const query = `
      INSERT INTO blogs (name, description, website_url) 
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

  async update(id: number, updateBlogDto: UpdateBlogDto): Promise<boolean> {
    const { name, description, websiteUrl } = updateBlogDto;

    const query = `
      UPDATE blogs 
        SET 
        name = COALESCE($1, name), 
        description = COALESCE($2, description), 
        website_url = COALESCE($3, website_url)
    WHERE id = $4
    RETURNING id;
    `;

    const result = await this.pool.query(query, [
      name,
      description,
      websiteUrl,
      id,
    ]);

    return result.rowCount > 0;
  }
}
