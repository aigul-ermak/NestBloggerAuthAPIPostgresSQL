import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from '../user/user.module';
import { BasicStrategy } from '../../base/guards/auth-guards/basic.strategy';
import { CreateUserRegistrationUseCase } from './usecases/createUserRegistrationUseCase';
import { EmailModule } from '../email/email.module';

const CommandHandlers = [CreateUserRegistrationUseCase];

@Module({
  imports: [CqrsModule, UserModule, EmailModule],
  providers: [...CommandHandlers, AuthService, BasicStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
