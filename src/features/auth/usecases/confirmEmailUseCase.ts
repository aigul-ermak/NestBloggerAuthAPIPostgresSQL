import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../features/user/repositories/users.repository';
import { UsersQueryRepository } from '../../user/repositories/users-query.repository';
import { User } from '../../user/entities/user.entity';

export class ConfirmEmailUseCaseCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmEmailUseCaseCommand)
export class ConfirmEmailUseCase
  implements ICommandHandler<ConfirmEmailUseCaseCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(command: ConfirmEmailUseCaseCommand): Promise<boolean> {
    const user: Partial<User> =
      await this.usersQueryRepository.findUserByConfirmationCode(command.code);

    if (!user) {
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'Confirmation code does not exist',
            field: 'code',
          },
        ],
      });
    }

    if (user.isConfirmed) {
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'Email already confirmed',
            field: 'code',
          },
        ],
      });
    }

    console.log('user', user.confirmationCode);
    console.log('command code', command.code);

    if (user.confirmationCode === command.code) {
      return await this.usersRepository.updateConfirmation(user.id);
    }
    return false;
  }
}
