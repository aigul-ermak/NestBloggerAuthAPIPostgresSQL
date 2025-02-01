import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionQueryRepository } from '../../session/repositories/session-query.repository';
import { UsersQueryRepository } from '../../user/repositories/users-query.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { SessionRepository } from '../../session/repositories/session.repository';

export class DeleteDeviceSessionUseCaseCommand {
  constructor(
    public userId: number,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteDeviceSessionUseCaseCommand)
export class DeleteDeviceSessionUseCase
  implements ICommandHandler<DeleteDeviceSessionUseCaseCommand>
{
  constructor(
    private sessionRepository: SessionRepository,
    private sessionQueryRepository: SessionQueryRepository,
  ) {}

  async execute(command: DeleteDeviceSessionUseCaseCommand) {
    const session = await this.sessionQueryRepository.getUserSessionByDeviceId(
      command.deviceId,
    );

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (command.userId !== session.userId) {
      throw new ForbiddenException('Session deletion denied');
    }

    return await this.sessionRepository.deleteSession(
      command.userId,
      command.deviceId,
    );
  }
}
