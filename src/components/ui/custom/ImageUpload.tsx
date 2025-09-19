'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AssetUploadConfig, 
  UploadedFile, 
  AssetUploadResult,
  Asset 
} from '@/types/assets';
import {
  validateFileType,
  validateFileSize,
  createPreviewUrl,
  revokePreviewUrl,
  formatFileSize,
  validateImageDimensions,
  compressImage,
  simulateUpload
} from '@/lib/asset-utils';

interface ImageUploadProps {
  config: AssetUploadConfig;
  onUploadComplete?: (assets: Asset[]) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  config,
  onUploadComplete,
  onUploadError,
  multiple = false,
  className = '',
  disabled = false
}: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Filter files based on multiple upload setting
    const filesToProcess = multiple ? fileArray : [fileArray[0]];
    
    const newUploadedFiles: UploadedFile[] = filesToProcess.map(file => ({
      file,
      status: 'pending' as const
    }));

    setUploadedFiles(prev => multiple ? [...prev, ...newUploadedFiles] : newUploadedFiles);

    // Process each file
    for (let i = 0; i < newUploadedFiles.length; i++) {
      const uploadedFile = newUploadedFiles[i];
      await processFile(uploadedFile, multiple ? uploadedFiles.length + i : i);
    }
  }, [multiple]);

  const processFile = async (uploadedFile: UploadedFile, index: number) => {
    try {
      const { file } = uploadedFile;

      // Validate file type
      if (!validateFileType(file, config.allowedTypes)) {
        throw new Error(`Invalid file type. Allowed types: ${config.allowedTypes.join(', ')}`);
      }

      // Validate file size
      if (!validateFileSize(file, config.maxFileSize)) {
        throw new Error(`File too large. Maximum size: ${formatFileSize(config.maxFileSize)}`);
      }

      // Validate image dimensions if it's an image
      if (file.type.startsWith('image/')) {
        const dimensions = await validateImageDimensions(file, config.maxWidth, config.maxHeight);
        if (!dimensions.valid) {
          throw new Error(`Image dimensions too large. Maximum: ${config.maxWidth || 'unlimited'}x${config.maxHeight || 'unlimited'}`);
        }
      }

      // Update status to uploading
      setUploadedFiles(prev => 
        prev.map((f, i) => 
          i === index ? { ...f, status: 'uploading' } : f
        )
      );

      // Compress image if needed
      let processedFile = file;
      if (file.type.startsWith('image/') && config.quality && config.quality < 1) {
        processedFile = await compressImage(
          file, 
          config.quality, 
          config.maxWidth, 
          config.maxHeight
        );
      }

      // Simulate upload (replace with actual upload logic)
      const result: AssetUploadResult = await simulateUpload(processedFile, config);

      if (result.success && result.asset) {
        // Update status to success
        setUploadedFiles(prev => 
          prev.map((f, i) => 
            i === index ? { 
              ...f, 
              status: 'success',
              progress: 100
            } : f
          )
        );

        // Call success callback
        if (onUploadComplete) {
          onUploadComplete([result.asset]);
        }
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      // Update status to error
      setUploadedFiles(prev => 
        prev.map((f, i) => 
          i === index ? { 
            ...f, 
            status: 'error',
            error: errorMessage
          } : f
        )
      );

      if (onUploadError) {
        onUploadError(errorMessage);
      }
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [disabled, handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev[index];
      if (fileToRemove.preview) {
        revokePreviewUrl(fileToRemove.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const clearAll = useCallback(() => {
    uploadedFiles.forEach(file => {
      if (file.preview) {
        revokePreviewUrl(file.preview);
      }
    });
    setUploadedFiles([]);
  }, [uploadedFiles]);

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragging 
            ? 'border-brand-primary bg-brand-primary/5' 
            : 'border-gray-300 hover:border-brand-primary/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-brand-primary" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
                {isDragging ? 'Drop files here' : 'Upload Images'}
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop files here, or click to select files
              </p>
              <p className="text-sm text-gray-500">
                Max size: {formatFileSize(config.maxFileSize)} • 
                Allowed: {config.allowedTypes.map(type => type.split('/')[1]).join(', ')}
                {config.maxWidth && config.maxHeight && (
                  <> • Max dimensions: {config.maxWidth}×{config.maxHeight}px</>
                )}
              </p>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
              disabled={disabled}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={config.allowedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-brand-charcoal">Uploaded Files</h4>
            {multiple && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAll}
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile, index) => (
              <FilePreview
                key={index}
                uploadedFile={uploadedFile}
                onRemove={() => removeFile(index)}
                config={config}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface FilePreviewProps {
  uploadedFile: UploadedFile;
  onRemove: () => void;
  config: AssetUploadConfig;
}

function FilePreview({ uploadedFile, onRemove, config }: FilePreviewProps) {
  const { file, status, error } = uploadedFile;
  const [preview, setPreview] = useState<string>('');

  React.useEffect(() => {
    if (file.type.startsWith('image/')) {
      const url = createPreviewUrl(file);
      setPreview(url);
      
      return () => {
        revokePreviewUrl(url);
      };
    }
  }, [file]);

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 bg-gray-400 rounded-full animate-pulse" />;
      case 'uploading':
        return <div className="w-4 h-4 bg-blue-500 rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'border-gray-300';
      case 'uploading':
        return 'border-blue-300 bg-blue-50';
      case 'success':
        return 'border-green-300 bg-green-50';
      case 'error':
        return 'border-red-300 bg-red-50';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <Card className={`${getStatusColor()} transition-colors`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Preview */}
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {preview ? (
              <img 
                src={preview} 
                alt={file.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-brand-charcoal truncate">
              {file.name}
            </p>
            <p className="text-sm text-gray-500">
              {formatFileSize(file.size)}
            </p>
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-gray-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}











