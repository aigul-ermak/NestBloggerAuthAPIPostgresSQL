import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../user/repositories/users.repository';
import { UsersQueryRepository } from '../user/repositories/users-query.repository';
import bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';

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

    const user: User =
      (await this.usersQueryRepository.findOneByLogin(loginOrEmail)) ||
      (await this.usersQueryRepository.findOneByEmail(loginOrEmail));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordHashed = user.passwordHash;
    const isPasswordValid = await bcrypt.compare(password, passwordHashed);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
