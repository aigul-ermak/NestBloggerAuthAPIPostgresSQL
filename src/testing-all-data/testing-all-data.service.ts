import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TestingAllDataService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async clearAllData(): Promise<void> {
    try {
      await this.userRepository.query('TRUNCATE TABLE "user" CASCADE');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw new InternalServerErrorException('Failed to clear all data');
    }
  }
}
