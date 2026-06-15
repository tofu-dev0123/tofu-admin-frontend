export type ImagesUploadRequest = {
  image_file: File;
  alt_text?: string;
};

export type ImagesUploadResponse = {
  image_id: number;
  url: string;
  alt_text: string;
};
