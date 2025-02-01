import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionQueryRepository } from '../../session/repositories/session-query.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { SessionRepository } from '../../session/repositories/session.repository';

export class DeleteOtherSessionsUseCaseCommand {
  constructor(
    public userId: number,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteOtherSessionsUseCaseCommand)
export class DeleteOtherSessionsUseCase
  implements ICommandHandler<DeleteOtherSessionsUseCaseCommand>
{
  constructor(
    private sessionRepository: SessionRepository,
    private sessionQueryRepository: SessionQueryRepository,
  ) {}

  async execute(command: DeleteOtherSessionsUseCaseCommand) {
    const session = await this.sessionQueryRepository.getUserSession(
      command.userId,
      command.deviceId,
    );

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return await this.sessionRepository.deleteOtherSessions(
      command.userId,
      command.deviceId,
    );
  }
}
