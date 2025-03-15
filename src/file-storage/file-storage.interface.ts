export interface FileStorage {
  uploadFiles(files: Express.Multer.File[], Options?: object): Promise<unknown>;
}
