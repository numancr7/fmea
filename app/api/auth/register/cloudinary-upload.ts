import cloudinary from 'cloudinary';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadAvatarToCloudinary(filePath: string) {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: 'FMEA_AVATARS',
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto' }
      ]
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload avatar to Cloudinary');
  }
}

// New function to handle base64 data
export async function uploadBase64ToCloudinary(base64Data: string) {
  try {
    // Remove data URL prefix if present
    const base64String = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    
    const result = await cloudinary.v2.uploader.upload(
      `data:image/jpeg;base64,${base64String}`,
      {
        folder: 'FMEA_AVATARS',
        resource_type: 'image',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto' }
        ]
      }
    );
    return result;
  } catch (error) {
    console.error('Cloudinary base64 upload error:', error);
    throw new Error('Failed to upload avatar to Cloudinary');
  }
}

// Function to handle buffer upload
export async function uploadBufferToCloudinary(buffer: Buffer, filename: string) {
  try {
    // Create temporary file path
    const tempFilePath = join(tmpdir(), `upload-${Date.now()}-${filename}`);

    // Write buffer to temp file
    await writeFile(tempFilePath, buffer);

    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(tempFilePath, {
      folder: 'FMEA_AVATARS',
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto' }
      ]
    });

    // Clean up temp file
    try {
      await import('fs').then(fs => fs.promises.unlink(tempFilePath));
    } catch (cleanupError) {
      console.warn('Failed to cleanup temp file:', cleanupError);
    }

    return result;
  } catch (error) {
    console.error('Cloudinary buffer upload error:', error);
    throw new Error('Failed to upload avatar to Cloudinary');
  }
} 