import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class BlogsQueryRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}
}
