import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from '../user/user.module';
import { BasicStrategy } from '../../base/guards/auth-guards/basic.strategy';
import { CreateUserRegistrationUseCase } from './usecases/createUserRegistrationUseCase';
import { EmailModule } from '../email/email.module';
import { LoginUserUseCase } from './usecases/loginUserUseCase';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionModule } from '../session/session.module';

const CommandHandlers = [CreateUserRegistrationUseCase, LoginUserUseCase];

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwtSettings.JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>(
              'jwtSettings.ACCESS_TOKEN_EXPIRY',
            ),
          },
        };
      },
    }),
    CqrsModule,
    UserModule,
    EmailModule,
    SessionModule,
  ],
  providers: [...CommandHandlers, AuthService, BasicStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
