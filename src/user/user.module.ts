import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserUseCase } from './usecases/createUserUseCase';

const CommandHandlers = [CreateUserUseCase];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [...CommandHandlers],
})
export class UserModule {}
