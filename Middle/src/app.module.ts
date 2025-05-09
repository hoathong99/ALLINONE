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
import { FreeAccessController } from './Controller/free-access/free-access.controller';
import config from './configuration'

@Module({
  imports: [HttpModule,
    // ConfigModule.forRoot({
    //   isGlobal: true, // Makes ConfigModule available in all modules
    //   // load: [config], // Loads the configuration function
    // }),
    ConfigModule.forRoot({
      isGlobal: true, // So you don't need to import it in every module
    })
  ],
  controllers: [AppController, BasicControllerController, ProcessControllerController, AuthController, FreeAccessController],
  providers: [AppService, ProcessService, FormService, AuthService, ],
})
export class AppModule { }
