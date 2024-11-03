import { InjectDataSource } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { DataSource, FindOneOptions } from 'typeorm';
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

  async findAll(
    filter: any,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    skip: number,
    limit: number,
  ): Promise<User[]> {
    const query = `
      SELECT * FROM "user"
      ${this.buildWhereClause(filter)}
      ORDER BY "${sortBy}" ${sortDirection.toUpperCase()}
      LIMIT $1 OFFSET $2
    `;
    const parameters = [limit, skip];
    const result = await this.dataSource.query(query, parameters);

    return result;
  }

  async countDocuments(filter: any): Promise<number> {
    const query = `
      SELECT COUNT(*) FROM "user"
      ${this.buildWhereClause(filter)}
    `;

    const result = await this.dataSource.query(query);
    return parseInt(result[0].count, 10);
  }

  private buildWhereClause(filter: any): string {
    if (!filter || !filter.$or || filter.$or.length === 0) return '';

    const whereConditions = filter.$or.map((condition: any) => {
      const [field, regexCondition] = Object.entries(condition)[0];
      const regexValue = (regexCondition as any).$regex;
      return `"${field}" ILIKE '%${regexValue}%'`;
    });

    return `WHERE ${whereConditions.join(' OR ')}`;
  }
}
