import { Test, TestingModule } from '@nestjs/testing';
import { FreeAccessController } from './free-access.controller';

describe('FreeAccessController', () => {
  let controller: FreeAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreeAccessController],
    }).compile();

    controller = module.get<FreeAccessController>(FreeAccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
