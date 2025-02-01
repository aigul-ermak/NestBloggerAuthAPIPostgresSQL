import { Module } from '@nestjs/common';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';
import { GetAllDevicesWithActiveSessionsUseCase } from './usecases/getAllDevicesWithActiveSessionsUseCase';
import { CqrsModule } from '@nestjs/cqrs';
import { SecurityController } from './security.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DeleteDeviceSessionUseCase } from './usecases/deleteDeviceSessionUseCase';
import { DeleteOtherSessionsUseCase } from './usecases/deleteOtherSessionsUseCase';

const CommandHandlers = [
  GetAllDevicesWithActiveSessionsUseCase,
  DeleteDeviceSessionUseCase,
  DeleteOtherSessionsUseCase,
];

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
    SessionModule,
  ],
  controllers: [SecurityController],
  providers: [...CommandHandlers],
})
export class SecurityModule {}
