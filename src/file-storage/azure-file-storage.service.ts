import { Injectable } from '@nestjs/common';
import { FileStorage } from './file-storage.interface';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class AzureFileStorage implements FileStorage {
  private containerClient: ContainerClient;

  constructor(configService: ConfigService) {
    const connectionString =
      configService.get<string>('AZURE_STORAGE_CONNECTION_STRING') || '';
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient =
      blobServiceClient.getContainerClient('dummy-client1');
  }

  async uploadFiles(files: Express.Multer.File[]) {
    console.log(files);
    const uploadPromises = files.map((file) =>
      this.uploadFile('dummy-client1', file),
    );
    return Promise.all(uploadPromises);
  }

  private async uploadFile(
    clientId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    await this.containerClient.createIfNotExists();
    const blobName = `${clientId}/${Date.now()}-${file.originalname}`; // Organize files by client ID
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });
    return blockBlobClient.url;
  }
}
