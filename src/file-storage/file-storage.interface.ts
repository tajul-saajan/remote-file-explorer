export interface FileStorage {
  uploadFiles(
    files: Express.Multer.File[],
    Options?: object,
    folder_name?: string,
  ): Promise<unknown>;

  listFiles(clientId?: string, folder_path?: string): Promise<string[]>;

  createFolder(folder_name: string, clientId?: string): Promise<string>;
}
