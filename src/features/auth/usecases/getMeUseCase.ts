import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../user/repositories/users-query.repository';
import { User } from '../../user/entities/user.entity';

export class GetMeUseCaseCommand {
  constructor(public userId: number) {}
}

@CommandHandler(GetMeUseCaseCommand)
export class GetMeUseCase implements ICommandHandler<GetMeUseCaseCommand> {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute(
    command: GetMeUseCaseCommand,
  ): Promise<{ email: string; login: string; userId: number }> {
    const user: User | null = await this.usersQueryRepository.findOneById(
      command.userId,
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      email: user.email,
      login: user.login,
      userId: user.id,
    };
  }
}
