import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BasicControllerController } from './Controller/basic-controller/basic-controller.controller';
import { ProcessControllerController } from './Controller/process-controller/process-controller.controller';
import { HttpModule } from '@nestjs/axios';
import { ProcessService } from './Services/Process/ProcessService';
import { FormService } from './Services/Process/FormService';
import { AuthController } from './Controller/auth/auth.controller';
import { AuthService } from './Guard/AuthService';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available in all modules
    })
  ],
  controllers: [AppController, BasicControllerController, ProcessControllerController, AuthController],
  providers: [AppService, ProcessService, FormService, AuthService],
})
export class AppModule { }
