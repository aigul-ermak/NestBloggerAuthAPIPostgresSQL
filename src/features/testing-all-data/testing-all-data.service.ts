import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class TestingAllDataService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async clearAllData(): Promise<void> {
    try {
      await this.pool.query('TRUNCATE TABLE users CASCADE');
      await this.pool.query('TRUNCATE TABLE sessions CASCADE');
      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw new InternalServerErrorException('Failed to clear all data');
    }
  }
}
