import { ConflictException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import { UsersQueryRepository } from '../repositories/users-query.repository';
import { UserOutputModel } from '../dto/model/user-output.model';

export class CreateUserUseCaseCommand {
  constructor(public createUserDto: CreateUserDto) {}
}

@CommandHandler(CreateUserUseCaseCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserUseCaseCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(command: CreateUserUseCaseCommand): Promise<UserOutputModel> {
    const { login, email, password } = command.createUserDto;

    const existingUser = await this.usersQueryRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = 10;
    const passwordHashed = await bcrypt.hash(password, saltRounds);

    const newUser = this.usersRepository.create({
      login,
      email,
      passwordHash: passwordHashed,
    });

    const savedUser = await this.usersRepository.save(await newUser);

    const savedNewUser: UserOutputModel = {
      id: savedUser.id,
      login: savedUser.login,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
    };

    return savedNewUser;
  }
}