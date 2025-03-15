import { Test, TestingModule } from '@nestjs/testing';
import { ExplorerController } from './explorer.controller';

describe('ExplorerController', () => {
  let controller: ExplorerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExplorerController],
    }).compile();

    controller = module.get<ExplorerController>(ExplorerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
