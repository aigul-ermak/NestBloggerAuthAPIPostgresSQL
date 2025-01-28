import { Module } from '@nestjs/common';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, SessionModule],
  controllers: [],
  providers: [],
})
export class SecurityModule {}
