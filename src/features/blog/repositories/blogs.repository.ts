import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class BlogsRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}
}
