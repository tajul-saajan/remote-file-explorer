import { Test, TestingModule } from '@nestjs/testing';
import { AzureFileStorage } from './azure-file-storage.service';

describe('AzureFileStorageService', () => {
  let service: AzureFileStorage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AzureFileStorage],
    }).compile();

    service = module.get<AzureFileStorage>(AzureFileStorage);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
