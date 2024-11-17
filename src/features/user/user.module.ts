import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserUseCase } from './usecases/createUserUseCase';
import { UsersRepository } from './repositories/users.repository';
import { UsersQueryRepository } from './repositories/users-query.repository';
import { GetAllUsersUseCase } from './usecases/getAllUsersUseCase';
import { DeleteUserUseCase } from './usecases/deleteUserUseCase';
import { DatabaseModule } from '../../database.module';

const CommandHandlers = [
  CreateUserUseCase,
  GetAllUsersUseCase,
  DeleteUserUseCase,
];

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [UserController],
  providers: [...CommandHandlers, UsersRepository, UsersQueryRepository],
  exports: [UsersRepository, UsersQueryRepository],
})
export class UserModule {}
