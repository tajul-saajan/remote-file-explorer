import { Inject, Injectable } from '@nestjs/common';
import { FileStorage } from '../file-storage/file-storage.interface';

@Injectable()
export class ExplorerService {
  constructor(@Inject('FILE_STORAGE') private fileStorage: FileStorage) {}

  async uploadFiles(files: Express.Multer.File[]) {
    return await this.fileStorage.uploadFiles(files);
  }
}
