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

    return result.rows[0] || null;
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

  // async getUserDevicesActiveSessions(userId: string): Promise<Session[]> {
  //   return await this.pool.query(
  //     `SELECT * FROM sessions
  //      WHERE "userId" = $1`,
  //     [userId],
  //   );
  // }
  //
  // async getAllSession(): Promise<Session[]> {
  //   return await this.dataSource.query(`SELECT * FROM sessions`);
  // }
}
