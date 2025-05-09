import { Module } from '@nestjs/common';
import { UsersService } from 'src/Services/User/UserService';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
