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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchHighlights();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (highlights.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === highlights.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // เปลี่ยนทุก 5 วินาที

      return () => clearInterval(interval);
    }
  }, [highlights.length]);

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

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? highlights.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === highlights.length - 1 ? 0 : currentIndex + 1);
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

        {/* Dynamic Layout: Single or Grid */}
        {highlights.length === 1 ? (
          /* Single Highlight - Full Hero Display */
          <div className="relative">
            <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-2xl">
              <div className="relative w-full h-full">
                <img
                  src={highlights[0].thumbnail}
                  alt={highlights[0].title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* Content */}
                <div
                  className="absolute inset-0 cursor-pointer flex items-center justify-center"
                  onClick={() => handlePlayVideo(highlights[0])}
                >
                  <div className="bg-white/90 hover:bg-white rounded-full p-4 transition-all duration-300 transform hover:scale-110">
                    <svg className="w-12 h-12 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Multiple Highlights - Grid with Carousel */
          <div className="relative">
            {/* Main Carousel Display */}
            <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-2xl">
              {highlights.map((highlight, index) => (
                <div
                  key={highlight._id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={highlight.thumbnail}
                      alt={highlight.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                      }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Content */}
                    <div
                      className="absolute inset-0 cursor-pointer flex items-center justify-center"
                      onClick={() => handlePlayVideo(highlight)}
                    >
                      <div className="bg-white/90 hover:bg-white rounded-full p-4 transition-all duration-300 transform hover:scale-110">
                        <svg className="w-12 h-12 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Grid Preview - Show below main carousel */}
            <div className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {highlights.map((highlight, index) => (
                  <div
                    key={highlight._id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${index === currentIndex
                      ? 'ring-4 ring-purple-500 scale-105 shadow-lg'
                      : 'hover:scale-105 shadow-md hover:shadow-lg'
                      }`}
                    onClick={() => goToSlide(index)}
                  >
                    <div className="aspect-video relative">
                      <img
                        src={highlight.thumbnail}
                        alt={highlight.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                        }}
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors duration-300"></div>

                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 hover:bg-white rounded-full p-3 transition-all duration-300 transform hover:scale-110">
                          <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>

                      {/* Active Indicator */}
                      {index === currentIndex && (
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows - Only for multiple highlights */}
            {highlights.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-10"
                  aria-label="คลิปก่อนหน้า"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-10"
                  aria-label="คลิปถัดไป"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Dots Indicator - Only for multiple highlights */}
            {highlights.length > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {highlights.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                      ? 'bg-purple-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    aria-label={`ไปยังคลิป ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Counter - Only for multiple highlights */}
            {highlights.length > 1 && (
              <div className="text-center mt-4">
                <p className="text-gray-600 text-sm">
                  {currentIndex + 1} / {highlights.length}
                </p>
              </div>
            )}
          </div>
        )}
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