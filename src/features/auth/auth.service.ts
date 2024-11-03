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
    const user = await this.usersQueryRepository.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

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
