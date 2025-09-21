import { Asset, AssetUploadConfig, AssetUploadResult } from '@/types/assets';

/**
 * Validates file type against allowed types
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validates file size against maximum size
 */
export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

/**
 * Creates a preview URL for image files
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a preview URL to free memory
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Gets file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Generates a unique filename with timestamp
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const extension = getFileExtension(originalName);
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExt}_${timestamp}.${extension}`;
}

/**
 * Formats file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validates an image file and returns dimensions
 */
export function validateImageDimensions(
  file: File,
  maxWidth?: number,
  maxHeight?: number
): Promise<{ width: number; height: number; valid: boolean }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const valid = 
        (!maxWidth || img.width <= maxWidth) && 
        (!maxHeight || img.height <= maxHeight);
      
      resolve({
        width: img.width,
        height: img.height,
        valid
      });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0, valid: false });
    };
    img.src = createPreviewUrl(file);
  });
}

/**
 * Compresses an image file
 */
export function compressImage(
  file: File,
  quality: number = 0.8,
  maxWidth?: number,
  maxHeight?: number
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions if max dimensions are specified
      if (maxWidth && width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (maxHeight && height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      } else {
        reject(new Error('Canvas context not available'));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = createPreviewUrl(file);
  });
}

/**
 * Default upload configurations for different asset categories
 */
export const DEFAULT_UPLOAD_CONFIGS: Record<string, AssetUploadConfig> = {
  logo: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.9,
    category: 'logo'
  },
  banner: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    category: 'banner'
  },
  gallery: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxWidth: 2048,
    maxHeight: 2048,
    quality: 0.8,
    category: 'gallery'
  },
  profile: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxWidth: 1000,
    maxHeight: 1000,
    quality: 0.9,
    category: 'profile'
  },
  event: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    category: 'event'
  },
  project: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    category: 'project'
  }
};

/**
 * Simulates file upload (replace with actual upload logic)
 */
export async function simulateUpload(
  file: File,
  config: AssetUploadConfig
): Promise<AssetUploadResult> {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  // Simulate occasional upload failure
  if (Math.random() < 0.1) {
    return {
      success: false,
      error: 'Upload failed. Please try again.'
    };
  }

  // Create a mock asset object
  const asset: Asset = {
    id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: file.name,
    url: createPreviewUrl(file), // In real implementation, this would be the server URL
    type: 'image',
    category: config.category,
    size: file.size,
    uploadedAt: new Date(),
    tags: []
  };

  return {
    success: true,
    asset,
    url: asset.url
  };
}














