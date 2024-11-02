import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(criteria: FindOneOptions<User>): Promise<User | null> {
    return await this.usersRepository.findOne(criteria);
  }
}
