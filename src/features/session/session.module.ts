import { Module } from '@nestjs/common';
import { SessionRepository } from './repositories/session.repository';
import { SessionQueryRepository } from './repositories/session-query.repository';
import { DatabaseModule } from '../../database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SessionRepository, SessionQueryRepository],
  exports: [SessionRepository, SessionQueryRepository],
})
export class SessionModule {}
