
/**
 * Cloudinary URL generation utility
 * 
 * This file provides functions for generating Cloudinary URLs
 */

// Define cloudinary configuration
const cloudinaryConfig = {
  cloudName: 'dvmrhs2ek',
  folder: 'freefire',
  secure: true,
};

/**
 * Generate a Cloudinary URL for an image with optional transformations
 * 
 * @param publicId - The public ID of the image
 * @param options - Optional transformation options
 * @returns The complete Cloudinary URL
 */
export const getCloudinaryUrl = (publicId: string, options: Record<string, any> = {}) => {
  const { cloudName, folder } = cloudinaryConfig;
  
  // Base URL for Cloudinary images
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  // Process transformation options
  const transformations: string[] = [];
  
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);
  
  // Add any custom transformations
  if (options.transformations) {
    transformations.push(...options.transformations);
  }
  
  // Build the transformation string
  const transformationString = transformations.length > 0 
    ? transformations.join(',') + '/' 
    : '';
  
  // Combine with the public ID, using the folder if provided
  const fullPublicId = folder ? `${folder}/${publicId}` : publicId;
  
  // Return the complete URL
  return `${baseUrl}/${transformationString}${fullPublicId}`;
};
