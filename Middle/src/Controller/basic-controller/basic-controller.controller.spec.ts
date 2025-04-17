import { Test, TestingModule } from '@nestjs/testing';
import { BasicControllerController } from './basic-controller.controller';

describe('BasicControllerController', () => {
  let controller: BasicControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BasicControllerController],
    }).compile();

    controller = module.get<BasicControllerController>(BasicControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
