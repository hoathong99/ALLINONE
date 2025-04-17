import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BasicControllerController } from './Controller/basic-controller/basic-controller.controller';
import { ProcessControllerController } from './Controller/process-controller/process-controller.controller';
import { HttpModule } from '@nestjs/axios';
import { ProcessService } from './Services/Process/ProcessService';
import { FormService } from './Services/Process/FormService';

@Module({
  imports: [HttpModule],
  controllers: [AppController, BasicControllerController, ProcessControllerController],
  providers: [AppService, ProcessService, FormService],
})
export class AppModule {}
