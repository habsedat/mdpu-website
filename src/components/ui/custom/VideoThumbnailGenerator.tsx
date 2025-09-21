'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play } from 'lucide-react';

interface VideoThumbnailGeneratorProps {
  src: string;
  className?: string;
  thumbnailTime?: number; // Time in seconds to capture thumbnail
  onThumbnailGenerated?: (dataUrl: string) => void;
  showPlayButton?: boolean;
  onClick?: () => void;
}

export function VideoThumbnailGenerator({
  src,
  className = '',
  thumbnailTime = 2,
  onThumbnailGenerated,
  showPlayButton = true,
  onClick
}: VideoThumbnailGeneratorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);

  const generateThumbnail = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;

      // Draw the current frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setThumbnailUrl(dataUrl);
      onThumbnailGenerated?.(dataUrl);
      
      console.log(`✅ Thumbnail generated for video at ${thumbnailTime}s`);
    } catch (error) {
      console.error('❌ Error generating thumbnail:', error);
      setHasError(true);
    }
  }, [thumbnailTime, onThumbnailGenerated]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.duration > thumbnailTime) {
        setIsGenerating(true);
        video.currentTime = thumbnailTime;
      } else if (video.duration > 0) {
        // If video is shorter than desired time, use middle of video
        setIsGenerating(true);
        video.currentTime = video.duration / 2;
      }
    };

    const handleSeeked = () => {
      if (isGenerating) {
        generateThumbnail();
        setIsGenerating(false);
        video.pause(); // Pause after generating thumbnail
      }
    };

    const handleError = (e: Event) => {
      console.error('❌ Video loading error:', e);
      setHasError(true);
      setIsGenerating(false);
    };

    const handleCanPlay = () => {
      setHasError(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    // Start loading
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [src, thumbnailTime, generateThumbnail, isGenerating]);

  if (hasError) {
    return (
      <div className={`relative bg-gray-900 flex items-center justify-center ${className}`}>
        <div className="text-center text-white p-4">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-sm">Video unavailable</div>
        </div>
        {showPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg cursor-pointer" onClick={onClick}>
              <Play className="w-6 h-6 text-gray-800 ml-1" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Hidden video for thumbnail generation */}
      <video
        ref={videoRef}
        src={src}
        className="hidden"
        muted
        preload="metadata"
        playsInline
        webkit-playsinline="true"
      />
      
      {/* Hidden canvas for thumbnail generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Thumbnail display */}
      <div className="relative w-full h-full bg-gray-900">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              {isGenerating ? (
                <>
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-2 mx-auto"></div>
                  <div className="text-sm">Generating thumbnail...</div>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-2">🎥</div>
                  <div className="text-sm">Loading video...</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Play button overlay */}
        {showPlayButton && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all cursor-pointer"
            onClick={onClick}
          >
            <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 text-gray-800 ml-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoThumbnailGenerator;
