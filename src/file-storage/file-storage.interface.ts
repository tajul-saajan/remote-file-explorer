export interface FileStorage {
  uploadFiles(
    files: Express.Multer.File[],
    Options?: object,
    folder_name?: string,
  ): Promise<unknown>;

  listFiles(clientId?: string, folder_path?: string): Promise<any>;

  createFolder(folder_name: string, clientId?: string): Promise<string>;

  deleteFiles(blobNames: string[], clientId?: string): Promise<void>;

  getFileStream(
    blobName: string,
    client_id?: string,
  ): Promise<NodeJS.ReadableStream>;
}
