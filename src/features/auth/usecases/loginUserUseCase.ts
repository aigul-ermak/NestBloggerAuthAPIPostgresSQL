import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from '../../user/repositories/users.repository';
import { UsersQueryRepository } from '../../user/repositories/users-query.repository';
import { UserLoginDto } from '../models/login-user.input.dto';
import { AccessTokenType } from '../models/types/accessTokenType';
import { RefreshTokenType } from '../models/types/refreshTokenType';
import { SessionRepository } from '../../session/repositories/session.repository';

export class LoginUserUseCaseCommand {
  constructor(
    public loginDto: UserLoginDto,
    public userIP: string,
    public userAgent: string,
  ) {}
}

@CommandHandler(LoginUserUseCaseCommand)
export class LoginUserUseCase
  implements ICommandHandler<LoginUserUseCaseCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sessionRepository: SessionRepository,
  ) {}

  async execute(command: LoginUserUseCaseCommand) {
    const accessSecret = this.configService.get<string>(
      'jwtSettings.JWT_ACCESS_SECRET',
    );
    const accessExpiry = this.configService.get<string>(
      'jwtSettings.ACCESS_TOKEN_EXPIRY',
    );

    const refreshSecret: string | undefined = this.configService.get<string>(
      'jwtSettings.JWT_REFRESH_SECRET',
    );
    const refreshExpiry: string | undefined = this.configService.get<string>(
      'jwtSettings.REFRESH_TOKEN_EXPIRY',
    );

    const userDeviceId: string = uuidv4();
    //TODO type and delete
    const user: any = await this.validateUser(
      command.loginDto.loginOrEmail,
      command.loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessTokenPayload: AccessTokenType = {
      loginOrEmail: command.loginDto.loginOrEmail,
      id: user.id,
      deviceId: userDeviceId,
    };

    const refreshTokenPayload: RefreshTokenType = {
      userId: user.id,
      deviceId: userDeviceId,
      userIP: command.userIP,
      userAgent: command.userAgent,
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {});

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: refreshSecret,
      expiresIn: refreshExpiry,
    });

    const decodedToken = this.jwtService.decode(refreshToken) as {
      iat: number;
      exp: number;
    };

    if (!decodedToken) {
      throw new Error('Failed to decode refresh token');
    }

    const iatDate = new Date(decodedToken.iat * 1000);
    const expDate = new Date(decodedToken.exp * 1000);

    const sessionUser = {
      userId: user.id,
      deviceId: userDeviceId,
      ip: command.userIP,
      title: command.userAgent,
      iatDate: iatDate,
      expDate: expDate,
    };

    await this.sessionRepository.createSession(sessionUser);

    return { accessToken, refreshToken };
  }

  private async validateUser(loginOrEmail: string, password: string) {
    // TODO type and delete
    const user: any | null =
      await this.usersQueryRepository.findOneByLogin(loginOrEmail);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
