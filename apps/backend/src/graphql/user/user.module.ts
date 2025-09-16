import { Module } from '@nestjs/common';

import { UsersModule } from '../../users/users.module';
import { UserResolver } from './user.resolver';

@Module({
  imports: [UsersModule],
  providers: [UserResolver],
  exports: [UserResolver],
})
export class UserGraphqlModule {}
