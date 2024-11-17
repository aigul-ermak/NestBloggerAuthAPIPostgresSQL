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
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

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

  async findOneById(id: number): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id = $1 LIMIT 1;`;
    const result = await this.pool.query(query, [id]);

    return result.rowCount > 0 ? result.rows[0] : null;
  }

  async findAll(
    // TODO type and delete
    filter: Partial<Record<string, any>>,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    skip: number,
    limit: number,
  ): Promise<User[]> {
    const allowedSortColumns = ['id', 'login', 'email', 'created_at'];
    if (!allowedSortColumns.includes(sortBy)) {
      throw new Error(`Invalid sort column: ${sortBy}`);
    }

    const whereClauses: string[] = [];
    const parameters: any[] = [];
    let paramIndex = 1;

    if (filter.login) {
      whereClauses.push(`u.login ILIKE $${paramIndex++}`);
      parameters.push(`%${filter.login}%`);
    }

    if (filter.email) {
      whereClauses.push(`u.email ILIKE $${paramIndex++}`);
      parameters.push(`%${filter.email}%`);
    }

    const whereClause = whereClauses.length
      ? `WHERE ${whereClauses.join(' OR ')}`
      : '';

    const query = `
  SELECT id, login, email, created_at
  FROM users u
  ${whereClause}
   ORDER BY 
      ${sortBy === 'login' || sortBy === 'email' ? `LOWER(u.${sortBy})` : `u.${sortBy}`} 
      ${sortDirection.toUpperCase()}, u.id ASC
    LIMIT $${paramIndex++}
  OFFSET $${paramIndex};
`;

    parameters.push(limit, skip);

    const result = await this.pool.query(query, parameters);
    return result.rows;
  }

  //TODO type?
  async countDocuments(filter: Partial<Record<string, any>>): Promise<number> {
    const whereClauses: string[] = [];
    const parameters: any[] = [];
    let paramIndex = 1;

    if (filter.login) {
      whereClauses.push(`login ILIKE $${paramIndex++}`);
      parameters.push(`%${filter.login}%`);
    }

    if (filter.email) {
      whereClauses.push(`email ILIKE $${paramIndex++}`);
      parameters.push(`%${filter.email}%`);
    }

    const whereClause = whereClauses.length
      ? `WHERE ${whereClauses.join(' OR ')}`
      : '';

    const query = `
    SELECT COUNT(*) AS count
    FROM users
    ${whereClause};
  `;

    const result = await this.pool.query(query, parameters);
    return parseInt(result.rows[0].count, 10);
  }
}
