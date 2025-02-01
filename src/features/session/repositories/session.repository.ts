import { Inject, Injectable } from '@nestjs/common';
import { Session } from '../entities/session.entity';
import { Pool } from 'pg';

@Injectable()
export class SessionRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async createSession(sessionUser: Partial<Session>): Promise<void> {
    const result = await this.pool.query(
      `INSERT INTO sessions ("user_id", "device_id", "ip", "title", "iat_date", "exp_date")
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
      [
        sessionUser.userId,
        sessionUser.deviceId,
        sessionUser.ip,
        sessionUser.title,
        sessionUser.iatDate,
        sessionUser.expDate,
      ],
    );
  }

  async updateSession(sessionUser: Partial<Session>): Promise<void> {
    await this.pool.query(
      `UPDATE sessions
       SET "iat_date" = $1, "exp_date" = $2
       WHERE "user_id" = $3 AND "device_id" = $4`,
      [
        sessionUser.iatDate,
        sessionUser.expDate,
        sessionUser.userId,
        sessionUser.deviceId,
      ],
    );
  }

  async deleteSession(userId: number, deviceId: string): Promise<boolean> {
    const result = await this.pool.query(
      `DELETE FROM sessions
       WHERE "user_id" = $1 AND "device_id" = $2`,
      [userId, deviceId],
    );
    return true;
  }

  async deleteOtherSessions(
    userId: number,
    currentDeviceId: string,
  ): Promise<boolean> {
    const result = await this.pool.query(
      `DELETE FROM sessions
     WHERE user_id = $1 AND device_id != $2`,
      [userId, currentDeviceId],
    );

    return result.rowCount > 0;
  }
}
