'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  src: string;
  name?: string;
  poster?: string;
  className?: string;
  autoGeneratePoster?: boolean;
  controls?: boolean;
  muted?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  style?: React.CSSProperties;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: (error: any) => void;
  onLoadedMetadata?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
}

export function VideoPlayer({
  src,
  name = 'Video',
  poster,
  className = '',
  autoGeneratePoster = true,
  controls = true,
  muted = false,
  preload = 'metadata',
  style,
  onLoadStart,
  onCanPlay,
  onError,
  onLoadedMetadata
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [posterGenerated, setPosterGenerated] = useState(false);

  // Generate thumbnail canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string>('');

  // Generate poster from video if needed
  useEffect(() => {
    if (autoGeneratePoster && !poster && videoRef.current && !posterGenerated) {
      const video = videoRef.current;
      
      const handleMetadataLoaded = () => {
        console.log(`📊 Video metadata loaded: ${name}, duration: ${video.duration}s`);
        if (video.duration > 2) {
          video.currentTime = 2;
        } else if (video.duration > 0) {
          video.currentTime = video.duration / 2;
        }
      };

      const handleSeeked = () => {
        if (!posterGenerated && canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 360;
            
            try {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
              setGeneratedThumbnail(thumbnailUrl);
              setPosterGenerated(true);
              console.log(`✅ Public video thumbnail generated for: ${name}`);
            } catch (error) {
              console.error('❌ Error generating public thumbnail:', error);
            }
          }
          
          if (!isPlaying) {
            video.pause();
          }
        }
      };

      const handleCanPlay = () => {
        console.log(`✅ Public video can play: ${name}`);
      };

      const handleError = (e: Event) => {
        console.error(`❌ Public video error for ${name}:`, e);
      };

      video.addEventListener('loadedmetadata', handleMetadataLoaded);
      video.addEventListener('seeked', handleSeeked);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      // Force load
      video.load();

      return () => {
        video.removeEventListener('loadedmetadata', handleMetadataLoaded);
        video.removeEventListener('seeked', handleSeeked);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [autoGeneratePoster, poster, posterGenerated, isPlaying, name]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.error('Error playing video:', error);
          setHasError(true);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreenToggle = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        } else if ((videoRef.current as any).webkitRequestFullscreen) {
          (videoRef.current as any).webkitRequestFullscreen();
        } else if ((videoRef.current as any).msRequestFullscreen) {
          (videoRef.current as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error('Video error:', e);
    setHasError(true);
    onError?.(e);
  };

  const handleVideoLoadStart = () => {
    setHasError(false);
    onLoadStart?.();
  };

  const handleVideoCanPlay = () => {
    setHasError(false);
    onCanPlay?.();
  };

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    handleDurationChange();
    onLoadedMetadata?.(e);
  };

  if (hasError) {
    return (
      <div className={`relative bg-gray-900 rounded-xl overflow-hidden ${className}`} style={style}>
        <div className="flex items-center justify-center h-64 text-white">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Video Unavailable</h3>
            <p className="text-gray-300 mb-4">Unable to load video: {name}</p>
            <Button
              onClick={() => {
                setHasError(false);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-xl overflow-hidden group ${className}`} style={style}>
      {/* Hidden canvas for thumbnail generation */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Thumbnail overlay when video is not playing */}
      {generatedThumbnail && !isPlaying && (
        <div className="absolute inset-0 z-10">
          <img
            src={generatedThumbnail}
            alt="Video thumbnail"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-50 transition-all cursor-pointer group">
            <div 
              className="w-20 h-20 bg-white bg-opacity-95 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"
              onClick={handlePlayPause}
            >
              <Play className="w-10 h-10 text-gray-800 ml-1" />
            </div>
          </div>
          
          {/* Video title overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="font-medium text-sm truncate">🎥 {name}</p>
            </div>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        poster={poster || generatedThumbnail || (autoGeneratePoster ? `${src}#t=2` : undefined)}
        className="w-full h-full object-contain"
        preload={preload}
        muted={muted}
        playsInline
        webkit-playsinline="true"
        onLoadStart={handleVideoLoadStart}
        onCanPlay={handleVideoCanPlay}
        onError={handleVideoError}
        onLoadedMetadata={handleVideoLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        controls={!controls ? false : undefined}
      >
        <p className="text-white p-6 text-center">
          Your browser does not support the video tag.
          <br />
          <span className="text-blue-400 text-sm">Please update your browser or contact support</span>
        </p>
      </video>

      {/* Custom Controls Overlay */}
      {controls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Progress Bar */}
          <div 
            className="w-full h-2 bg-white/30 rounded-full mb-4 cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-white rounded-full transition-all duration-150"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-2"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-2"
                onClick={handleMuteToggle}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-white text-sm font-medium">{name}</span>
              
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-2"
                onClick={handleFullscreenToggle}
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {!isPlaying && currentTime === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-sm">Loading {name}...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
