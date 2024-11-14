import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Session } from '../entities/session.entity';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async createSession(sessionUser: Partial<Session>): Promise<string> {
    const result = await this.dataSource.query(
      `INSERT INTO sessions ("userId", "deviceId", "ip", "title", "iatDate", "expDate")
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

    return result[0].id;
  }

  async updateSession(sessionUser: Partial<Session>): Promise<void> {
    await this.dataSource.query(
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
    const result = await this.dataSource.query(
      `DELETE FROM sessions
       WHERE "userId" = $1 AND "deviceId" = $2`,
      [userId, deviceId],
    );

    return result.affectedRows > 0;
  }

  async deleteOtherSessions(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `DELETE FROM sessions
       WHERE "userId" = $1 AND "deviceId" != $2`,
      [userId, deviceId],
    );

    return result.affectedRows > 0;
  }
}
