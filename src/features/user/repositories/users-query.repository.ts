import { User } from '../entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

interface FindOneCriteria {
  where: {
    email: string;
  };
}

@Injectable()
export class UsersQueryRepository {
  constructor(
    @Inject('DATABASE_POOL') private readonly pool: Pool,
    // @InjectRepository(User)
    // private readonly usersRepository: Repository<User>,
    // @InjectDataSource()
    // private dataSource: DataSource,
  ) {}

  async findOneByLogin(login: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE login = $1 LIMIT 1;`;
    const result = await this.pool.query(query, [login]);
    return result.rowCount > 0 ? result.rows[0] : null;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE email = $1 LIMIT 1;`;
    const result = await this.pool.query(query, [email]);

    return result.rowCount > 0 ? result.rows[0] : null;
    // const whereClauses: string[] = [];
    // const parameters: string[] = [];
    //
    // if (criteria.where) {
    //   Object.entries(criteria.where).forEach(([key, value], index) => {
    //     whereClauses.push(`"${key}" = $${index + 1}`);
    //     parameters.push(value);
    //   });
  }

  // const query = `
  //   SELECT * FROM "user"
  //   ${whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : ''}
  //   LIMIT 1
  // `;
  // const result = await this.dataSource.query(query, parameters);
  //
  // return result.length > 0 ? result[0] : null;
  // }

  // async findAll(
  //   // TODO type and delete
  //   filter: Partial<Record<string, any>>,
  //   sortBy: string,
  //   sortDirection: 'asc' | 'desc',
  //   skip: number,
  //   limit: number,
  // ): Promise<User[]> {
  //   const query = this.dataSource
  //     .createQueryBuilder(User, 'user')
  //     .select(['user.id', 'user.login', 'user.email', 'user.createdAt'])
  //     .where(
  //       new Brackets((qb) => {
  //         if (filter.login) {
  //           qb.orWhere('user.login ILIKE :login', {
  //             login: `%${filter.login}%`,
  //           });
  //         }
  //         if (filter.email) {
  //           qb.orWhere('user.email ILIKE :email', {
  //             email: `%${filter.email}%`,
  //           });
  //         }
  //       }),
  //     )
  //     .orderBy(`user.${sortBy}`, sortDirection.toUpperCase() as 'ASC' | 'DESC')
  //     .skip(skip)
  //     .take(limit);
  //
  //   return query.getMany();
  // }

  // async countDocuments(filter: any): Promise<number> {
  //   const query = this.dataSource
  //     .createQueryBuilder(User, 'user')
  //     .select('COUNT(user.id)', 'count')
  //     .where(
  //       new Brackets((qb) => {
  //         if (filter.login) {
  //           qb.orWhere('user.login ILIKE :login', {
  //             login: `%${filter.login}%`,
  //           });
  //         }
  //         if (filter.email) {
  //           qb.orWhere('user.email ILIKE :email', {
  //             email: `%${filter.email}%`,
  //           });
  //         }
  //       }),
  //     );
  //
  //   const result = await query.getRawOne();
  //   return parseInt(result.count, 10);
  // }
}
