import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { RefreshTokenGuard } from '../../base/guards/jwt-guards/refresh-token.guard';
import { GetAllDevicesWithActiveSessionsUseCaseCommand } from './usecases/getAllDevicesWithActiveSessionsUseCase';
import { DeleteDeviceSessionUseCaseCommand } from './usecases/deleteDeviceSessionUseCase';
import { DeleteOtherSessionsUseCaseCommand } from './usecases/deleteOtherSessionsUseCase';

@Controller('security')
export class SecurityController {
  constructor(private commandBus: CommandBus) {}

  @Get('/devices')
  @HttpCode(200)
  @UseGuards(RefreshTokenGuard)
  async getAllDevicesWithActiveSessions(@Req() request: Request) {
    if (!request.user)
      throw new UnauthorizedException('User info was not provided');

    const { userId } = request.user;

    const activeSessions = await this.commandBus.execute(
      new GetAllDevicesWithActiveSessionsUseCaseCommand(userId),
    );

    return activeSessions;
  }

  @Delete('/devices/:deviceId')
  @HttpCode(204)
  @UseGuards(RefreshTokenGuard)
  async deleteDeviceSession(
    @Req() request: Request,
    @Param('deviceId') deviceId: string,
  ) {
    if (!request.user)
      throw new UnauthorizedException('User info was not provided');

    const { deviceId: tokenDeviceId, userId } = request.user;

    return this.commandBus.execute(
      new DeleteDeviceSessionUseCaseCommand(userId, deviceId),
    );
  }

  @Delete('/devices')
  @HttpCode(204)
  @UseGuards(RefreshTokenGuard)
  async deleteOtherSessions(@Req() request: Request) {
    if (!request.user)
      throw new UnauthorizedException('User info was not provided');

    const { userId, deviceId } = request.user;

    return this.commandBus.execute(
      new DeleteOtherSessionsUseCaseCommand(userId, deviceId),
    );
  }
}
