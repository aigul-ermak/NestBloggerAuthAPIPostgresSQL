import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { RefreshTokenType } from '../../../features/auth/models/types/refreshTokenType';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SessionQueryRepository } from '../../../features/session/repositories/session-query.repository';
import { Session } from '../../../features/session/entities/session.entity';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private sessionQueryRepository: SessionQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const refreshToken = request.cookies?.refreshToken;

    const refreshSecret = this.configService.get<string>(
      'jwtSettings.JWT_REFRESH_SECRET',
    );

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: refreshSecret,
      });

      const { userId, userIP, deviceId, userAgent }: RefreshTokenType = decoded;

      const iatDate = new Date(decoded.iat * 1000);

      const session: Session = await this.sessionQueryRepository.getUserSession(
        userId,
        deviceId,
      );

      if (!session) {
        throw new UnauthorizedException(`Session not found`);
      }

      if (session.iatDate.getTime() !== iatDate.getTime()) {
        throw new UnauthorizedException(`Refresh token has become invalid'`);
      }

      request.user = { userId, userIP, deviceId, userAgent };

      return true;
    } catch (error) {
      if ((error as Error).name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token has expired');
      }

      throw new UnauthorizedException(`Invalid refresh token: ${error}`);
    }
  }
}
