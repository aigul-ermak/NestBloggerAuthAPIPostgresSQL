import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    const accessSecret = this.configService.get<string>(
      'jwtSettings.JWT_ACCESS_SECRET',
    );
    this.configService.get<string>('jwtSettings.ACCESS_TOKEN_EXPIRY');

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token, { secret: accessSecret });

      request['user'] = {
        userId: decoded.id,
        deviceId: decoded.deviceId,
        userIP: request.ip ?? 'testip',
        userAgent: request.headers['user-agent'] ?? 'test-user-agent',
      };

      return true;
    } catch (error) {
      if (Error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }

      throw new UnauthorizedException('Invalid token');
    }
  }
}
