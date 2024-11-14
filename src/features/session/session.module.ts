import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionRepository } from './repositories/session.repository';
import { SessionQueryRepository } from './repositories/session-query.repository';
import { Session } from './entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionRepository, SessionQueryRepository],
  exports: [SessionRepository, SessionQueryRepository],
})
export class SessionModule {}
