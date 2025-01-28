import {
  Controller,
  Get,
  HttpCode,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { RefreshTokenGuard } from '../../base/guards/jwt-guards/refresh-token.guard';
import { GetAllDevicesWithActiveSessionsUseCaseCommand } from './usecases/getAllDevicesWithActiveSessionsUseCase';

@Controller('security')
export class SecurityController {
  constructor(private commandBus: CommandBus) {}

  @Get('/devices')
  @HttpCode(200)
  @UseGuards(RefreshTokenGuard)
  async getAllDevicesWithActiveSessions(@Req() request: Request) {
    console.log('inside endpoint');

    if (!request.user)
      throw new UnauthorizedException('User info was not provided');

    const { userId } = request.user;

    const activeSessions = await this.commandBus.execute(
      new GetAllDevicesWithActiveSessionsUseCaseCommand(userId),
    );

    return activeSessions;
  }
}
