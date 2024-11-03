import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersQueryRepository {
  constructor(
    // @InjectRepository(User)
    // private readonly usersRepository: Repository<User>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findOne(criteria: FindOneOptions<User>): Promise<User | null> {
    const whereClauses = [];
    const parameters = [];
    if (criteria.where) {
      Object.entries(criteria.where).forEach(([key, value], index) => {
        whereClauses.push(`"${key}" = $${index + 1}`);
        parameters.push(value);
      });
    }

    const query = `
      SELECT * FROM "user" 
      ${whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : ''}
      LIMIT 1
    `;
    const result = await this.dataSource.query(query, parameters);

    return result.length > 0 ? result[0] : null;
  }
}
