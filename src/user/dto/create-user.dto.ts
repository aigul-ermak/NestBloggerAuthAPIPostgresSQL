import { IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../base/decorators/transform/trim';
import { IsOptionalEmail } from '../../base/decorators/validation/isOptionalEmailDecorator';

export class CreateUserDto {
  @IsString()
  @Trim()
  @Length(3, 10, { message: 'Length not correct' })
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message:
      'Login can only contain letters, numbers, underscores, and hyphens.',
  })
  login: string;

  @Length(6, 20, { message: 'Length not correct' })
  password: string;

  @IsOptionalEmail()
  email: string;
}
