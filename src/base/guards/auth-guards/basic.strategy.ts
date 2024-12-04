import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { ConfigService } from '@nestjs/config';
//
// @Injectable()
// export class BasicStrategy extends PassportStrategy(Strategy) {
//   constructor(private configService: ConfigService) {
//     super({
//       passReqToCallback: true,
//     });
//   }
//
//   public validate = async (req, username, password): Promise<boolean> => {
//     const basicAuthUsername = this.configService.get<string>(
//       'basicAuthSettings.BASIC_AUTH_USERNAME',
//     );
//     const basicAuthPassword = this.configService.get<string>(
//       'basicAuthSettings.BASIC_AUTH_PASSWORD',
//     );
//
//     if (basicAuthUsername === username && basicAuthPassword === password) {
//       return true;
//     }
//
//     throw new UnauthorizedException();
//   };
// }

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super();
  }

  async validate(username: string, password: string): Promise<boolean> {
    const basicAuthSettings = this.configService.get('basicAuthSettings');

    if (
      username === basicAuthSettings.BASIC_AUTH_USERNAME &&
      password === basicAuthSettings.BASIC_AUTH_PASSWORD
    ) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
