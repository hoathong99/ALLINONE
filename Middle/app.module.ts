import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { UsersService } from './users/users.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ProcessService } from 'services/ProcessService';
import { FormService } from 'services/FormService';

@Module({
  imports: [
    AuthModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true, // makes env variables available globally
    }),
  ],
  controllers: [AppController],
  providers: [UsersService, ProcessService, FormService],
})
export class AppModule {}