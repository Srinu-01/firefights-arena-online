
// Using the v2 API from cloudinary
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with our cloud details
cloudinary.config({
  cloud_name: 'dvmrhs2ek',
  secure: true
});

/**
 * Get a Cloudinary URL for a given public ID with optional transformations
 * @param publicId - The public ID of the resource
 * @param options - Optional transformation options
 * @returns The Cloudinary URL
 */
export const getCloudinaryUrl = (publicId: string, options: Record<string, any> = {}) => {
  return cloudinary.url(publicId, {
    folder: 'freefire',
    ...options
  });
};

export { cloudinary };
