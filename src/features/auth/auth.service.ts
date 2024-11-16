import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../user/repositories/users.repository';
import { UsersQueryRepository } from '../user/repositories/users-query.repository';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async validateUser(loginOrEmail: string, password: string) {
    // const user = await this.usersQueryRepository.findOne({
    //   where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    // });

    const existingUserByLogin =
      await this.usersQueryRepository.findOneByLogin(loginOrEmail);
    const existingUserByEmail =
      await this.usersQueryRepository.findOneByEmail(loginOrEmail);

    if (!existingUserByLogin && !existingUserByEmail) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUserByLogin.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return existingUserByLogin;
  }
}
