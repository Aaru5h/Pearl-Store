export interface UploadResult {
  url: string;
  publicId: string;
}

export interface IFileStorage {
  upload(fileBuffer: Buffer, folder?: string): Promise<UploadResult>;
  delete(publicId: string): Promise<boolean>;
  generatePresignedUrl(fileName: string, folder?: string): Promise<string>;
}
