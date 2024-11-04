import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    // @InjectDataSource()
    // private dataSource: DataSource,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
    // todo get raw sql only, post/put typeorm
    // return await this.dataSource.query(`INSERT INTO "user" VALUES ()`);
  }

  async save(user: Partial<User>): Promise<User> {
    return await this.usersRepository.save(user);
  }
}