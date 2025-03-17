export type AuthUser = {
  username: string;
  id: string;
};

export type ListItem = {
  name: string;
  isFolder: boolean;
  metadata: object;
  properties: {
    contentType: string;
    contentLength: number;
    lastModified: string;
    etag: string;
  };
};
