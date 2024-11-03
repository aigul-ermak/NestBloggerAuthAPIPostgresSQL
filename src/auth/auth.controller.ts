import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}
}
