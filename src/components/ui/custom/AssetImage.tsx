'use client';

import React from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  onError?: () => void;
  onLoad?: () => void;
}

export function AssetImage({
  src,
  alt,
  className = '',
  fallbackIcon,
  width,
  height,
  loading = 'lazy',
  onError,
  onLoad
}: AssetImageProps) {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  if (hasError || !src) {
    return (
      <div 
        className={cn(
          'bg-gray-100 flex items-center justify-center text-gray-400',
          className
        )}
        style={{ width, height }}
      >
        {fallbackIcon || <ImageIcon className="w-8 h-8" />}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <ImageIcon className="w-8 h-8 text-gray-300" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          'transition-opacity duration-200',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      />
    </div>
  );
}















