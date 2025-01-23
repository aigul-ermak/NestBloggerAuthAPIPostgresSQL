import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateUserRegistrationUseCaseCommand } from './usecases/createUserRegistrationUseCase';
import { Request, Response } from 'express';
import { UserLoginDto } from './models/login-user.input.dto';
import { LoginUserUseCaseCommand } from './usecases/loginUserUseCase';
import { EmailDto } from './models/email.input.dto';
import { SendNewCodeToEmailUseCaseCommand } from './usecases/sendNewCodeToEmailUseCase';
import { ConfirmEmailUseCaseCommand } from './usecases/confirmEmailUseCase';
import { GetMeUseCaseCommand } from './usecases/getMeUseCase';
import { JwtAuthGuard } from '../../base/guards/jwt-guards/jwt.auth.guard';

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
  async registration(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.commandBus.execute(
      new CreateUserRegistrationUseCaseCommand(createUserDto),
    );
  }

  @Post('/registration-email-resending')
  @HttpCode(204)
  async sendNewCodeToEmail(@Body() resendEmailDto: EmailDto): Promise<void> {
    await this.commandBus.execute(
      new SendNewCodeToEmailUseCaseCommand(resendEmailDto),
    );
  }

  @Post('/registration-confirmation')
  @HttpCode(204)
  async confirmRegistration(@Body('code') code: string): Promise<void> {
    await this.commandBus.execute(new ConfirmEmailUseCaseCommand(code));
  }

  @Get('/me')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getUser(
    @Req() request: Request,
  ): Promise<{ email: string; login: string; userId: number }> {
    if (!request.user)
      throw new UnauthorizedException('User info was not provided');

    const { userId } = request.user;

    return this.commandBus.execute(new GetMeUseCaseCommand(userId));
  }
}
