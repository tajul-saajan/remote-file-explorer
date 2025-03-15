export interface FileStorage {
  uploadFiles(files: Express.Multer.File[]): Promise<unknown>;
}
