import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../base/decorators/transform/trim';

export class UserLoginDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  loginOrEmail: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  password: string;
}
