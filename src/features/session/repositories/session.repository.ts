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
       SET "iatDate" = $1, "expDate" = $2
       WHERE "userId" = $3 AND "deviceId" = $4`,
      [
        sessionUser.iatDate,
        sessionUser.expDate,
        sessionUser.userId,
        sessionUser.deviceId,
      ],
    );
  }

  async deleteSession(userId: string, deviceId: string): Promise<boolean> {
    const result = await this.pool.query(
      `DELETE FROM sessions
       WHERE "userId" = $1 AND "deviceId" = $2`,
      [userId, deviceId],
    );

    // return result.affectedRows > 0;
    return true;
  }

  async deleteOtherSessions(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result = await this.pool.query(
      `DELETE FROM sessions
       WHERE "userId" = $1 AND "deviceId" != $2`,
      [userId, deviceId],
    );

    // return result.affectedRows > 0;
    return true;
  }
}
