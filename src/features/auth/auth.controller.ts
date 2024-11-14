import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateUserRegistrationUseCaseCommand } from './usecases/createUserRegistrationUseCase';
import { Request, Response } from 'express';
import { UserLoginDto } from './models/login-user.input.dto';
import { LoginUserUseCaseCommand } from './usecases/loginUserUseCase';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() loginDto: UserLoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userIP: string = req.ip ?? 'testuserip';
    const userAgent: string = req.headers['user-agent'] ?? 'user-agent';

    const { accessToken, refreshToken } = await this.commandBus.execute(
      new LoginUserUseCaseCommand(loginDto, userIP, userAgent),
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  }

  @Post('/registration')
  @HttpCode(204)
  async registration(@Body() createUserDto: CreateUserDto) {
    await this.commandBus.execute(
      new CreateUserRegistrationUseCaseCommand(createUserDto),
    );
  }
}
