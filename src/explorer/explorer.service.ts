import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { FileStorage } from '../file-storage/file-storage.interface';
import * as archiver from 'archiver';
import { Response } from 'express';

@Injectable()
export class ExplorerService {
  constructor(@Inject('FILE_STORAGE') private fileStorage: FileStorage) {}

  async uploadFiles(files: Express.Multer.File[], folder_name?: string) {
    return await this.fileStorage.uploadFiles(files, {}, folder_name);
  }

  async getAllFiles(
    client_id?: string,
    folder_path?: string,
  ): Promise<string[]> {
    return await this.fileStorage.listFiles(client_id, folder_path);
  }

  async createFolder(folder_name: string, clientId?: string): Promise<string> {
    return await this.fileStorage.createFolder(folder_name, clientId);
  }

  async deleteFiles(blobNames: string[], clientId?: string): Promise<void> {
    await this.fileStorage.deleteFiles(blobNames, clientId);
  }

  async downloadFiles(res: Response, fileNames: string[], clientId?: string) {
    if (fileNames.length === 1) {
      const fileStream = await this.fileStorage.getFileStream(
        fileNames[0],
        clientId,
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileNames[0]}"`,
      );

      fileStream.pipe(res);
    } else {
      // Multiple files: Compress into a ZIP file
      const archive = archiver('zip', { zlib: { level: 9 } }); // High compression level
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="files.zip"');

      archive.on('error', (err) => {
        throw new Error(`Failed to create archive: ${err.message}`);
      });

      archive.pipe(res);

      for (const file of fileNames) {
        const fileStream = await this.fileStorage.getFileStream(file);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        archive.append(fileStream, { name: file });
      }

      await archive.finalize();
    }
  }
}
