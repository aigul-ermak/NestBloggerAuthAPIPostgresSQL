import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../repositories/users.repository';
import { UsersQueryRepository } from '../repositories/users-query.repository';
import { User } from '../entities/user.entity';

export class DeleteUserUseCaseCommand {
  constructor(public id: number) {}
}

@CommandHandler(DeleteUserUseCaseCommand)
export class DeleteUserUseCase
  implements ICommandHandler<DeleteUserUseCaseCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(command: DeleteUserUseCaseCommand): Promise<boolean> {
    const user: User | null = await this.usersQueryRepository.findOneById(
      command.id,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.usersRepository.deleteById(command.id);
  }
}
