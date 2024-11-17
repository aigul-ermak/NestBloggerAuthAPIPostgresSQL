import { BadRequestException } from '@nestjs/common';

import bcrypt from 'bcrypt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../../../features/email/email.service';
import { UsersRepository } from '../../../features/user/repositories/users.repository';
import { UsersQueryRepository } from '../../user/repositories/users-query.repository';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { User } from '../../user/entities/user.entity';

export class CreateUserRegistrationUseCaseCommand {
  constructor(public createUserDto: CreateUserDto) {}
}

@CommandHandler(CreateUserRegistrationUseCaseCommand)
export class CreateUserRegistrationUseCase
  implements ICommandHandler<CreateUserRegistrationUseCaseCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
    private emailService: EmailService,
  ) {}

  async execute(command: CreateUserRegistrationUseCaseCommand): Promise<void> {
    const user: User =
      (await this.usersQueryRepository.findOneByLogin(
        command.createUserDto.login,
      )) ||
      (await this.usersQueryRepository.findOneByEmail(
        command.createUserDto.email,
      ));

    if (user) {
      const field = user ? 'login' : 'email';
      throw new BadRequestException({
        errorsMessages: [
          {
            message: `User with this ${field} already exists`,
            field: field,
          },
        ],
      });
    }

    const confirmationCode = uuidv4();
    const saltRounds = 10;
    const passwordHashed = await bcrypt.hash(
      command.createUserDto.password,
      saltRounds,
    );

    const newUser: Partial<User> = {
      login: command.createUserDto.login,
      email: command.createUserDto.email,
      passwordHash: passwordHashed,
      // passwordRecoveryCode: null,
      // recoveryCodeExpirationDate: null,
      // createdAt: new Date(),
      // confirmationCode: confirmationCode as string,
      // expirationDate: add(new Date(), { hours: 1, minutes: 3 }),
      // isConfirmed: false,
    };

    const createdUser = this.usersRepository.create(newUser);

    if (!newUser) {
      throw new BadRequestException('User creation failed');
    }

    try {
      await this.emailService.sendEmailConfirmationMessage(newUser);
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  }
}
