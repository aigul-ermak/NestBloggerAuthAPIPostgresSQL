import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionQueryRepository } from '../../session/repositories/session-query.repository';
import { UsersQueryRepository } from '../../user/repositories/users-query.repository';
import { NotFoundException } from '@nestjs/common';

export class GetAllDevicesWithActiveSessionsUseCaseCommand {
  constructor(public userId: number) {}
}

@CommandHandler(GetAllDevicesWithActiveSessionsUseCaseCommand)
export class GetAllDevicesWithActiveSessionsUseCase
  implements ICommandHandler<GetAllDevicesWithActiveSessionsUseCaseCommand>
{
  constructor(
    private sessionsQueryRepository: SessionQueryRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(command: GetAllDevicesWithActiveSessionsUseCaseCommand) {
    const currentUser = await this.usersQueryRepository.findOneById(
      command.userId,
    );

    if (!currentUser) {
      throw new NotFoundException(`User not found`);
    }

    const activeSessions =
      await this.sessionsQueryRepository.getUserDevicesActiveSessions(
        command.userId,
      );

    return activeSessions.map((session) => ({
      deviceId: session.deviceId,
      ip: session.ip,
      title: session.title,
      lastActiveDate: session.iatDate.toISOString(),
    }));
  }
}
