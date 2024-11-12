import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateUserRegistrationUseCaseCommand } from './usecases/createUserRegistrationUseCase';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('/registration')
  @HttpCode(204)
  async registration(@Body() createUserDto: CreateUserDto) {
    await this.commandBus.execute(
      new CreateUserRegistrationUseCaseCommand(createUserDto),
    );
  }
}
