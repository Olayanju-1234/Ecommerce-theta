// src/services/Upload/UploadImage.ts
import { v2 as cloudinary } from 'cloudinary';

export const UploadProductImage = async (filePath: string): Promise<string> => {
  if (!filePath) throw new Error('No file uploaded');

  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'product_images',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });

  return result.secure_url;
};
