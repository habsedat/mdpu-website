export interface Asset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video';
  category: 'logo' | 'banner' | 'gallery' | 'document' | 'profile' | 'event' | 'project';
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  description?: string;
  uploadedAt: Date;
  uploadedBy?: string;
  tags?: string[];
}

export interface UploadedFile {
  file: File;
  preview?: string;
  progress?: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface AssetUploadConfig {
  maxFileSize: number; // in bytes
  allowedTypes: string[];
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // for image compression
  category: Asset['category'];
}

export interface AssetFilters {
  category?: Asset['category'];
  type?: Asset['type'];
  tags?: string[];
  search?: string;
}

export interface AssetUploadResult {
  success: boolean;
  asset?: Asset;
  error?: string;
  url?: string;
}














