export interface FileStorage {
  uploadFiles(files: Express.Multer.File[], Options?: object): Promise<unknown>;

  listFiles(clientId?: string, folder_path?: string): Promise<string[]>;

  createFolder(folder_name: string, clientId?: string): Promise<string>;
}
