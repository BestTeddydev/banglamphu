'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface StoryPage {
  pageNumber: number;
  image: string;
  text: string;
  title?: string;
}

interface Story {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  pages: StoryPage[];
  createdAt: string;
}

export default function StoryReaderPage() {
  const { id } = useParams();
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(0);

  useEffect(() => {
    if (id) {
      fetchStory();
    }
  }, [id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevPage();
      } else if (e.key === 'ArrowRight') {
        nextPage();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, story?.pages.length, isFullscreen]);

  // Mouse wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Check if we're in the story reader area
      const target = e.target as HTMLElement;
      const storyReader = target.closest('[data-story-reader]');
      
      if (!storyReader) return;
      
      // Prevent default scrolling behavior only in story reader
      e.preventDefault();
      
      // Throttle scroll events to prevent too fast page changes
      const now = Date.now();
      if (now - lastScrollTime < 500) return; // 500ms throttle
      
      setLastScrollTime(now);
      
      // Determine scroll direction
      if (e.deltaY > 0) {
        // Scroll down - go to next page
        nextPage();
      } else if (e.deltaY < 0) {
        // Scroll up - go to previous page
        prevPage();
      }
    };

    // Add wheel event listener with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentPage, story?.pages.length, lastScrollTime]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stories/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('ไม่พบนิทานนี้');
        } else {
          throw new Error('Failed to fetch story');
        }
      }
      const data = await response.json();
      setStory(data);
    } catch (err) {
      console.error('Error fetching story:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (story && currentPage < story.pages.length - 1) {
      setCurrentPage(currentPage + 1);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 300);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 300);
    }
  };

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดนิทาน...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/tourism/stories" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            กลับไปยังรายการนิทาน
          </Link>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบนิทาน</h2>
          <p className="text-gray-600 mb-4">นิทานที่คุณค้นหาอาจไม่มีอยู่</p>
          <Link href="/tourism/stories" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            กลับไปยังรายการนิทาน
          </Link>
        </div>
      </div>
    );
  }

  const currentPageData = story.pages[currentPage];

  return (
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isFullscreen ? 'max-w-none h-full flex flex-col' : 'max-w-6xl'}`}>
        {/* Header */}
        {!isFullscreen && (
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <Link href="/tourism" className="hover:text-green-600">ท่องเที่ยว</Link>
              <span>›</span>
              <Link href="/tourism/stories" className="hover:text-green-600">นิทาน</Link>
              <span>›</span>
              <span className="text-gray-900">{story.title}</span>
            </nav>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{story.title}</h1>
                <p className="text-gray-600">{story.description}</p>
              </div>
              <button
                onClick={toggleFullscreen}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
              >
                เปิดแบบเต็มหน้าจอ
              </button>
            </div>
          </div>
        )}

        {/* Story Reader */}
        <div 
          data-story-reader
          className={`${isFullscreen ? 'flex-1 flex flex-col bg-black' : 'bg-white rounded-lg shadow-lg overflow-hidden'}`}
        >
          {/* Page Navigation */}
          <div className={`px-6 py-4 flex items-center justify-between ${isFullscreen ? 'bg-black text-white' : 'bg-gray-100'}`}>
            <div className="flex items-center space-x-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`px-6 py-3 rounded-lg hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all duration-200 text-lg ${
                  isFullscreen 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
                }`}
              >
                ← ก่อนหน้า
              </button>
              <span className={`font-semibold text-lg ${isFullscreen ? 'text-white' : 'text-gray-700'}`}>
                หน้า {currentPage + 1} จาก {story.pages.length}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === story.pages.length - 1}
                className={`px-6 py-3 rounded-lg hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all duration-200 text-lg ${
                  isFullscreen 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
                }`}
              >
                ถัดไป →
              </button>
            </div>
            
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-lg hover:bg-opacity-20 transition-colors duration-200 ${
                isFullscreen 
                  ? 'text-white hover:bg-white' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
              title={isFullscreen ? "ปิดแบบเต็มหน้าจอ (F หรือ ESC)" : "เปิดแบบเต็มหน้าจอ (F)"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isFullscreen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                )}
              </svg>
            </button>
          </div>

          {/* Page Content */}
          <div className={`${isFullscreen ? 'flex-1 flex items-center justify-center p-4' : 'p-6'}`}>
            <div className={`${isFullscreen ? 'w-full h-full flex items-center justify-center' : 'max-w-2xl mx-auto'}`}>
              {/* Image Only - Vertical Layout */}
              <div className={`flex justify-center transition-all duration-300 ${
                isScrolling ? 'opacity-70 scale-95' : 'opacity-100 scale-100'
              }`}>
                <img
                  src={currentPageData.image}
                  alt={currentPageData.title || `หน้า ${currentPage + 1}`}
                  className={`w-full h-auto object-contain transition-all duration-300 ${
                    isFullscreen 
                      ? 'max-h-full max-w-full' 
                      : 'max-w-lg rounded-lg shadow-lg'
                  }`}
                />
              </div>
              
              {/* Scroll Indicator */}
              {isScrolling && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    {currentPageData.title || `หน้า ${currentPage + 1}`}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Page Thumbnails */}
          {!isFullscreen && (
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex space-x-2 overflow-x-auto">
                {story.pages.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index)}
                    className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                      index === currentPage
                        ? 'border-green-500 ring-2 ring-green-200'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={page.image}
                      alt={`หน้า ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isFullscreen && (
          <div className="mt-8">
            <div className="flex justify-center space-x-4 mb-4">
              <Link
                href="/tourism/stories"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                กลับไปยังรายการนิทาน
              </Link>
              <button
                onClick={() => setCurrentPage(0)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
              >
                เริ่มต้นใหม่
              </button>
            </div>
            
            {/* Keyboard Shortcuts Help */}
            <div className="text-center text-sm text-gray-500">
              <p>💡 เคล็ดลับ: ใช้ลูกศรซ้าย/ขวา, scroll mouse หรือ F เพื่อเปิดเต็มหน้าจอ</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
