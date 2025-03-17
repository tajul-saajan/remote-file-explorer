import { Injectable, NotFoundException } from '@nestjs/common';
import { FileStorage } from './file-storage.interface';
import { BlobServiceClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import { ListItem } from '../types';

@Injectable()
export class AzureFileStorage implements FileStorage {
  private blobServiceClient: BlobServiceClient;

  constructor(configService: ConfigService) {
    const connectionString =
      configService.get<string>('AZURE_STORAGE_CONNECTION_STRING') || '';
    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
  }

  private async getContainerClient(clientId: string, forceCreate = false) {
    const containerClient = this.blobServiceClient.getContainerClient(clientId);
    if (forceCreate) {
      await containerClient.createIfNotExists();
    }
    return containerClient;
  }

  async uploadFiles(
    files: Express.Multer.File[],
    options: { client_id: string },
    folder_name?: string,
  ) {
    console.log(files);
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, options.client_id, folder_name),
    );
    return Promise.all(uploadPromises);
  }

  private async uploadFile(
    file: Express.Multer.File,
    clientId: string,
    folder_name?: string,
  ): Promise<string> {
    const containerClient = await this.getContainerClient(clientId, true);
    let blobName = `${Date.now()}-${file.originalname}`; // Organize files by client ID
    if (folder_name) {
      blobName = `${folder_name}/${blobName}`;
    }
    const blockBlobClient = containerClient.getBlockBlobClient(
      `${clientId}/${blobName}`,
    );
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });
    return blockBlobClient.url;
  }

  async listFiles(clientId: string, folderPath?: string, search?: string) {
    const prefix = folderPath ? `${clientId}/${folderPath}/` : `${clientId}/`;
    const containerClient = await this.getContainerClient(clientId, true);
    const blobs = containerClient.listBlobsFlat({ prefix });

    const files: ListItem[] = [];
    for await (const blob of blobs) {
      const blobClient = containerClient.getBlobClient(blob.name);
      const properties = await blobClient.getProperties();

      const item: ListItem = {
        name: blob.name,
        isFolder: blob.name.endsWith('/'),
        metadata: properties.metadata as unknown as object,
        properties: {
          contentType: properties.contentType as unknown as string,
          contentLength: properties.contentLength as unknown as number,
          lastModified: properties.lastModified as unknown as string,
          etag: properties.etag as unknown as string,
        },
      };

      if ((search && item.name.includes(search)) || !search) {
        files.push(item);
      }
    }

    return files;
  }

  async createFolder(folderName: string, clientId: string): Promise<string> {
    const folderPath = `${clientId}/${folderName}/`; // Add trailing slash for folder
    const containerClient = await this.getContainerClient(clientId);
    const blockBlobClient = containerClient.getBlockBlobClient(folderPath);

    await blockBlobClient.uploadData(Buffer.from(''), {
      blobHTTPHeaders: { blobContentType: 'application/octet-stream' },
    });

    return blockBlobClient.url;
  }

  async deleteFiles(blobNames: string[], client_id: string): Promise<void> {
    const containerClient = await this.getContainerClient(client_id);
    const blobBatchClient = containerClient.getBlobBatchClient();
    const blobClients = blobNames.map((blobName) => {
      return containerClient.getBlobClient(`${client_id}/${blobName}`);
    });

    await blobBatchClient.deleteBlobs(blobClients);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  async getFileStream(blobName: string, client_id: string) {
    const containerClient = await this.getContainerClient(client_id);
    const blobClient = containerClient.getBlobClient(blobName);
    const exists = await blobClient.exists();
    if (!exists) {
      throw new NotFoundException('No file exists');
    }

    const downloadResponse = await blobClient.download();
    return downloadResponse.readableStreamBody;
  }
}
