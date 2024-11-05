import { InjectDataSource } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Brackets, DataSource, FindOneOptions } from 'typeorm';
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
    const whereClauses: string[] = [];
    const parameters: string[] = [];

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

  async findAll(
    // TODO type and delete
    filter: Partial<Record<string, any>>,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    skip: number,
    limit: number,
  ): Promise<User[]> {
    const query = this.dataSource
      .createQueryBuilder(User, 'user')
      .select(['user.id', 'user.login', 'user.email', 'user.createdAt'])
      .where(
        new Brackets((qb) => {
          if (filter.login) {
            qb.orWhere('user.login ILIKE :login', {
              login: `%${filter.login}%`,
            });
          }
          if (filter.email) {
            qb.orWhere('user.email ILIKE :email', {
              email: `%${filter.email}%`,
            });
          }
        }),
      )
      .orderBy(`user.${sortBy}`, sortDirection.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    return await query.getMany();
  }

  async countDocuments(filter: any): Promise<number> {
    const query = this.dataSource
      .createQueryBuilder(User, 'user')
      .select('COUNT(user.id)', 'count')
      .where(
        new Brackets((qb) => {
          if (filter.login) {
            qb.orWhere('user.login ILIKE :login', {
              login: `%${filter.login}%`,
            });
          }
          if (filter.email) {
            qb.orWhere('user.email ILIKE :email', {
              email: `%${filter.email}%`,
            });
          }
        }),
      );

    const result = await query.getRawOne();
    return parseInt(result.count, 10);
  }
}
