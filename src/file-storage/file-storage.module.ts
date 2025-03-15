import { Module } from '@nestjs/common';
import { AzureFileStorage } from './azure-file-storage.service';

@Module({
  providers: [
    {
      provide: 'FILE_STORAGE',
      useClass: AzureFileStorage,
    },
  ],
  exports: ['FILE_STORAGE'],
})
export class FileStorageModule {}
