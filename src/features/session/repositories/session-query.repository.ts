import { Inject, Injectable } from '@nestjs/common';
import { Session } from '../entities/session.entity';
import { Pool } from 'pg';

@Injectable()
export class SessionQueryRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async getUserSession(
    userId: number,
    deviceId: string,
  ): Promise<Session | null> {
    const result = await this.pool.query(
      `SELECT * FROM sessions
       WHERE "user_id" = $1 AND "device_id" = $2
       LIMIT 1`,
      [userId, deviceId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    const session: Session = {
      id: row.id,
      userId: row.user_id,
      deviceId: row.device_id,
      ip: row.ip,
      title: row.title,
      iatDate: new Date(row.iat_date),
      expDate: new Date(row.exp_date),
    };

    return session;
  }

  async getUserSessionByDeviceId(deviceId: string): Promise<Session | null> {
    const result = await this.pool.query(
      `SELECT * FROM sessions
       WHERE "deviceId" = $1
       LIMIT 1`,
      [deviceId],
    );

    return result[0] || null;
  }

  async getUserDevicesActiveSessions(userId: number) {
    const query = `SELECT * FROM sessions WHERE "user_id" = $1`;
    const result = await this.pool.query(query, [userId]);
    console.log('result', result.rows);

    // return result.rows;

    return result.rows.map((row) => ({
      ip: row.ip,
      title: row.title,
      lastActiveDate: row.iat_date,
      deviceId: row.device_id,
    }));
  }

  // async getAllSession(): Promise<Session[]> {
  //   return await this.dataSource.query(`SELECT * FROM sessions`);
  // }
}
