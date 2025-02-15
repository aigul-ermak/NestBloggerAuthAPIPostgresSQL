import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PostInputType } from '../dto/types/postInputType';

@Injectable()
export class PostsRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async createPost(post: PostInputType): Promise<number> {
    const { title, shortDescription, content, blogId, createdAt } = post;
    const query = `
      INSERT INTO posts (title, short_description, content, blog_id, created_at, likes_count, dislikes_count, my_status)  
      VALUES ($1, $2, $3, $4, $5, 0, 0, 'None') 
      RETURNING id;
    `;
    const result = await this.pool.query(query, [
      title,
      shortDescription,
      content,
      blogId,
      createdAt,
    ]);

    return result.rows[0].id;
  }

  async updatePost(updatePost): Promise<boolean> {
    const { postId, title, shortDescription, content } = updatePost;

    console.log('Update Post Payload:', updatePost);
    const query = `
    UPDATE posts
    SET title = $1, short_description = $2, content = $3
    WHERE id = $4
    RETURNING id;    
  `;

    const result = await this.pool.query(query, [
      title,
      shortDescription,
      content,
      postId,
    ]);

    return result.rowCount > 0;
  }
}
