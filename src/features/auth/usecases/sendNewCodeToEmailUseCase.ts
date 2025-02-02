import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../../../features/email/email.service';
import { UsersRepository } from '../../../features/user/repositories/users.repository';
import { UsersQueryRepository } from '../../user/repositories/users-query.repository';
import { User } from '../../user/entities/user.entity';
import { EmailDto } from '../models/email.input.dto';

export class SendNewCodeToEmailUseCaseCommand {
  constructor(public resendEmailDto: EmailDto) {}
}

@CommandHandler(SendNewCodeToEmailUseCaseCommand)
export class SendNewCodeToEmailUseCase
  implements ICommandHandler<SendNewCodeToEmailUseCaseCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
    private emailService: EmailService,
  ) {}

  async execute(command: SendNewCodeToEmailUseCaseCommand): Promise<boolean> {
    const newCode: string = uuidv4();

    const user: User = await this.usersQueryRepository.findOneByEmail(
      command.resendEmailDto.email,
    );

    if (!user) {
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'Email does not exist',
            field: 'email',
          },
        ],
      });
    }

    // if (user.confirmationCode !== null) {
    //   throw new BadRequestException({
    //     errorsMessages: [
    //       {
    //         message: 'Email already confirmed',
    //         field: 'email',
    //       },
    //     ],
    //   });
    // }

    await this.usersRepository.updateUserCode(user.id, newCode);

    let userWithNewCode: User =
      await await this.usersQueryRepository.findOneByEmail(user.email);

    this.emailService.sendEmailMessage(userWithNewCode);

    return true;
  }
}
