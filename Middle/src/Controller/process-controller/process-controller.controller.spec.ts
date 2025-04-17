import { Test, TestingModule } from '@nestjs/testing';
import { ProcessControllerController } from './process-controller.controller';

describe('ProcessControllerController', () => {
  let controller: ProcessControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessControllerController],
    }).compile();

    controller = module.get<ProcessControllerController>(ProcessControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
