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
    if (result.rowCount > 0) {
      const user = result.rows[0];

      return {
        id: user.id,
        login: user.login,
        email: user.email,
        passwordHash: user.password_hash,
        passwordRecoveryCode: user.password_recovery_code,
        recoveryCodeExpirationDate: user.recovery_code_expiration_date,
        createdAt: user.created_at,
        confirmationCode: user.confirmation_code,
        expirationDate: user.expiration_date,
        isConfirmed: user.is_confirmed,
      } as User;
    }

    return null;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE email = $1 LIMIT 1;`;
    const result = await this.pool.query(query, [email]);

    if (result.rowCount > 0) {
      const user = result.rows[0];

      // Explicit mapping
      return {
        id: user.id,
        login: user.login,
        email: user.email,
        passwordHash: user.password_hash,
        passwordRecoveryCode: user.password_recovery_code,
        recoveryCodeExpirationDate: user.recovery_code_expiration_date,
        createdAt: user.created_at,
        confirmationCode: user.confirmation_code,
        expirationDate: user.expiration_date,
        isConfirmed: user.is_confirmed,
      } as User;
    }

    return null;
  }

  async findOneById(id: number): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id = $1 LIMIT 1;`;
    const result = await this.pool.query(query, [id]);

    return result.rowCount > 0 ? result.rows[0] : null;
  }

  async findAll(
    // TODO type and delete
    filter: Partial<Record<string, any>>,
    sortBy: string = 'created_at',
    sortDirection: 'asc' | 'desc' = 'desc',
    skip: number,
    limit: number,
  ): Promise<User[]> {
    const columnMapping: Record<string, string> = {
      createdAt: 'created_at',
      login: 'login',
      email: 'email',
      id: 'id',
    };

    // let dbSortBy = columnMapping[sortBy] || 'created_at';
    //
    // const allowedSortColumns = Object.values(columnMapping);
    // if (!allowedSortColumns.includes(dbSortBy)) {
    //   dbSortBy = 'created_at';
    // }

    const whereClauses: string[] = [];
    const parameters: any[] = [];
    let paramIndex: number = 1;

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
    SELECT id, login, email, created_at
    FROM users
    ${whereClause}
    ORDER BY 
         CASE 
            WHEN '${sortBy}' = 'login' THEN login COLLATE "C"
            ELSE ${sortBy}::VARCHAR
        END ${sortDirection.toUpperCase()}
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

  async findUserByConfirmationCode(code: string): Promise<User | null> {
    const query = `SELECT id, confirmation_code AS "confirmationCode", is_confirmed AS "isConfirmed" FROM users WHERE confirmation_code = $1;
  `;

    const result = await this.pool.query(query, [code]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }
}
