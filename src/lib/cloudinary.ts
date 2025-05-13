
import { Cloudinary } from 'cloudinary-core';

const cloudinaryConfig = {
  cloud_name: 'dvmrhs2ek',
  secure: true
};

const cloudinary = new Cloudinary(cloudinaryConfig);

export const getCloudinaryUrl = (publicId: string, options = {}) => {
  return cloudinary.url(publicId, {
    folder: 'freefire',
    ...options
  });
};

export { cloudinary };
