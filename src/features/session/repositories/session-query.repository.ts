import { Inject, Injectable } from '@nestjs/common';
import { Session } from '../entities/session.entity';
import { Pool } from 'pg';

@Injectable()
export class SessionQueryRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async getUserSession(
    userId: string,
    deviceId: string,
  ): Promise<Session | null> {
    const result = await this.pool.query(
      `SELECT * FROM sessions
       WHERE "userId" = $1 AND "deviceId" = $2
       LIMIT 1`,
      [userId, deviceId],
    );

    return result[0] || null;
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
