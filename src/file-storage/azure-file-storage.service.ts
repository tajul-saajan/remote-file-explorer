import { Injectable } from '@nestjs/common';
import { FileStorage } from './file-storage.interface';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class AzureFileStorage implements FileStorage {
  private blobServiceClient: BlobServiceClient;

  constructor(configService: ConfigService) {
    const connectionString =
      configService.get<string>('AZURE_STORAGE_CONNECTION_STRING') || '';
    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
  }

  private async getContainerClient(clientId: string) {
    const containerClient = this.blobServiceClient.getContainerClient(clientId);
    await containerClient.createIfNotExists();
    return containerClient;
  }

  async uploadFiles(
    files: Express.Multer.File[],
    options: { client_id: string | undefined },
  ) {
    console.log(files);
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, options?.client_id),
    );
    return Promise.all(uploadPromises);
  }

  private async uploadFile(
    file: Express.Multer.File,
    clientId = 'dummy-client1',
  ): Promise<string> {
    const containerClient = await this.getContainerClient(clientId);
    const blobName = `${clientId}/${Date.now()}-${file.originalname}`; // Organize files by client ID
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });
    return blockBlobClient.url;
  }
}
