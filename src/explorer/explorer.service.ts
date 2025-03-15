import { Inject, Injectable } from '@nestjs/common';
import { FileStorage } from '../file-storage/file-storage.interface';

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
}
