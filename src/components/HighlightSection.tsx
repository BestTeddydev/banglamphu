'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import VideoModal from './VideoModal';

interface Highlight {
  _id: string;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  duration?: string;
  category?: string;
  tags?: string[];
  viewCount?: number;
  createdAt: string;
}

export default function HighlightSection() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    try {
      const response = await fetch('/api/highlights?limit=6');
      const data = await response.json();
      if (data.success) {
        setHighlights(data.data);
      }
    } catch (error) {
      console.error('Error fetching highlights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVideoPlatform = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('vimeo.com')) return 'Vimeo';
    if (url.includes('facebook.com')) return 'Facebook';
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('tiktok.com')) return 'TikTok';
    return 'Video';
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handlePlayVideo = (highlight: Highlight) => {
    setSelectedHighlight(highlight);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHighlight(null);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังโหลดไฮไลท์...</p>
          </div>
        </div>
      </section>
    );
  }

  if (highlights.length === 0) {
    return null; // ไม่แสดงส่วนไฮไลท์ถ้าไม่มีไฮไลท์
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ไฮไลท์
          </h2>
          <p className="text-lg text-gray-600">
            คลิปไฮไลท์และวิดีโอที่น่าสนใจจากชุมชนบางลำพู
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((highlight) => (
            <div key={highlight._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img
                    src={highlight.thumbnail}
                    alt={highlight.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                  />
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all duration-300">
                  <button
                    onClick={() => handlePlayVideo(highlight)}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-300 transform hover:scale-110"
                  >
                    <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>

                {/* Duration Badge */}
                {highlight.duration && (
                  <div className="absolute bottom-2 right-2">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-black bg-opacity-70 text-white">
                      {highlight.duration}
                    </span>
                  </div>
                )}

                {/* Category Badge */}
                {highlight.category && (
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {highlight.category}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {highlight.title}
                </h3>

                {highlight.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {highlight.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{formatViewCount(highlight.viewCount || 0)} ครั้ง</span>
                  </div>

                  <div className="text-sm text-gray-500">
                    {getVideoPlatform(highlight.videoUrl)}
                  </div>
                </div>

                {/* Tags */}
                {highlight.tags && highlight.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {highlight.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {highlight.tags.length > 3 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          +{highlight.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePlayVideo(highlight)}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium text-center"
                  >
                    <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    ดูคลิป
                  </button>

                  <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/highlights"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            ดูไฮไลท์ทั้งหมด
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Video Modal */}
      {selectedHighlight && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={closeModal}
          videoUrl={selectedHighlight.videoUrl}
          title={selectedHighlight.title}
          description={selectedHighlight.description}
          thumbnail={selectedHighlight.thumbnail}
          duration={selectedHighlight.duration}
          category={selectedHighlight.category}
          tags={selectedHighlight.tags}
          viewCount={selectedHighlight.viewCount}
        />
      )}
    </section>
  );
}
