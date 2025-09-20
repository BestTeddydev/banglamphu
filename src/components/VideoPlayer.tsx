'use client';

import { useState, useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  thumbnail?: string;
  className?: string;
}

export default function VideoPlayer({ videoUrl, title, thumbnail, className = '' }: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract video ID and platform
  const getVideoInfo = (url: string) => {
    try {
      // YouTube
      if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
        let videoId = '';
        if (url.includes('youtube.com/watch')) {
          const params = new URLSearchParams(url.split('?')[1]);
          videoId = params.get('v') || '';
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        return {
          platform: 'youtube',
          videoId,
          embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
        };
      }

      // Vimeo
      if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1].split('?')[0];
        return {
          platform: 'vimeo',
          videoId,
          embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`
        };
      }

      // Facebook
      if (url.includes('facebook.com/') && url.includes('/videos/')) {
        const videoId = url.split('/videos/')[1].split('/')[0];
        return {
          platform: 'facebook',
          videoId,
          embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`
        };
      }

      // Instagram
      if (url.includes('instagram.com/p/') || url.includes('instagram.com/reel/')) {
        return {
          platform: 'instagram',
          videoId: '',
          embedUrl: url
        };
      }

      // TikTok
      if (url.includes('tiktok.com/')) {
        return {
          platform: 'tiktok',
          videoId: '',
          embedUrl: url
        };
      }

      return null;
    } catch (error) {
      console.error('Error parsing video URL:', error);
      return null;
    }
  };

  const videoInfo = getVideoInfo(videoUrl);

  useEffect(() => {
    if (videoInfo) {
      setIsLoaded(true);
    } else {
      setError('ไม่สามารถเล่นวิดีโอจากลิงก์นี้ได้');
    }
  }, [videoUrl]);

  if (error) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-gray-600 mb-4">{error}</p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            เปิดในแท็บใหม่
          </a>
        </div>
      </div>
    );
  }

  if (!videoInfo) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  // Handle different platforms
  if (videoInfo.platform === 'instagram' || videoInfo.platform === 'tiktok') {
    // For Instagram and TikTok, we'll show a link to open in new tab
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">
            {videoInfo.platform === 'instagram' ? 'Instagram' : 'TikTok'} ไม่รองรับการเล่นในเว็บไซต์
          </p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            เปิดใน {videoInfo.platform === 'instagram' ? 'Instagram' : 'TikTok'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {isLoaded ? (
        <iframe
          src={videoInfo.embedUrl}
          title={title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>กำลังโหลดวิดีโอ...</p>
          </div>
        </div>
      )}
    </div>
  );
}
