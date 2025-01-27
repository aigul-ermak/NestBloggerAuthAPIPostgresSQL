import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../user/repositories/users-query.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SessionRepository } from '../../session/repositories/session.repository';
import { UsersRepository } from '../../user/repositories/users.repository';
import { SessionQueryRepository } from '../../session/repositories/session-query.repository';
import { UnauthorizedException } from '@nestjs/common';

export class LogoutUserUseCaseCommand {
  constructor(
    public userId: number,
    public deviceId: string,
  ) {}
}

@CommandHandler(LogoutUserUseCaseCommand)
export class LogoutUserUseCase
  implements ICommandHandler<LogoutUserUseCaseCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sessionRepository: SessionRepository,
    private sessionQueryRepository: SessionQueryRepository,
  ) {}

  async execute(command: LogoutUserUseCaseCommand): Promise<boolean> {
    const session = await this.sessionQueryRepository.getUserSession(
      command.userId,
      command.deviceId,
    );

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    await this.sessionRepository.deleteSession(
      command.userId,
      command.deviceId,
    );

    return true;
  }
}
