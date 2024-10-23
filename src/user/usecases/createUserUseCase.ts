import { ConflictException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export class CreateUserUseCaseCommand {
  constructor(public createUserDto: CreateUserDto) {}
}

@CommandHandler(CreateUserUseCaseCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserUseCaseCommand>
{
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async execute(command: CreateUserUseCaseCommand): Promise<User> {
    const { login, email, password } = command.createUserDto;

    const existingUser = await this.usersRepository.findOne({
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
      password: passwordHashed,
    });

    return this.usersRepository.save(newUser);
  }
}
