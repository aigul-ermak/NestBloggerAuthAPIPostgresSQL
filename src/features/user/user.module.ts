import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserUseCase } from './usecases/createUserUseCase';
import { UsersRepository } from './repositories/users.repository';
import { UsersQueryRepository } from './repositories/users-query.repository';
import { Post } from '../post/entities/post.entity';
import { GetAllUsersUseCase } from './usecases/getAllUsersUseCase';

const CommandHandlers = [CreateUserUseCase, GetAllUsersUseCase];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User, Post])],
  controllers: [UserController],
  providers: [...CommandHandlers, UsersRepository, UsersQueryRepository],
  exports: [UsersRepository, UsersQueryRepository],
})
export class UserModule {}
