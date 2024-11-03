import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from '../user/user.module';
import { BasicStrategy } from '../base/guards/auth-guards/basic.strategy';

@Module({
  imports: [CqrsModule, UserModule],
  providers: [AuthService, BasicStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
