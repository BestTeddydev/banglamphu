'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import VideoPlayer from '@/components/VideoPlayer';

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

export default function HighlightDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchHighlight(params.id as string);
    }
  }, [params.id]);

  const fetchHighlight = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/highlights/${id}`);
      const data = await response.json();

      if (data.success) {
        setHighlight(data.data);
      } else {
        setError(data.message || 'ไม่พบไฮไลท์');
      }
    } catch (error) {
      console.error('Error fetching highlight:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลไฮไลท์');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getVideoPlatform = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('vimeo.com')) return 'Vimeo';
    if (url.includes('facebook.com')) return 'Facebook';
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('tiktok.com')) return 'TikTok';
    return 'Video';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดรายละเอียดคลิป...</p>
        </div>
      </div>
    );
  }

  if (error || !highlight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบไฮไลท์</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              กลับ
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              หน้าแรก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                กลับ
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                หน้าแรก
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-gray-900 font-medium">ไฮไลท์</span>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <VideoPlayer
              videoUrl={highlight.videoUrl}
              title={highlight.title}
              thumbnail={highlight.thumbnail}
              className="w-full h-96 lg:h-[500px]"
            />
          </div>

          {/* Video Details */}
          <div className="space-y-6">
            {/* Title and Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {highlight.title}
              </h1>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{formatViewCount(highlight.viewCount || 0)} ครั้ง</span>
                </div>

                {highlight.duration && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{highlight.duration}</span>
                  </div>
                )}

                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2H7z" />
                  </svg>
                  <span>{getVideoPlatform(highlight.videoUrl)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {highlight.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">คำอธิบาย</h3>
                <p className="text-gray-700 leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            )}

            {/* Category and Tags */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลเพิ่มเติม</h3>
              <div className="space-y-3">
                {highlight.category && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">หมวดหมู่</span>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {highlight.category}
                    </span>
                  </div>
                )}

                {highlight.tags && highlight.tags.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700 block mb-2">แท็ก</span>
                    <div className="flex flex-wrap gap-2">
                      {highlight.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-3">
                <a
                  href={highlight.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center"
                >
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  เปิดใน {getVideoPlatform(highlight.videoUrl)}
                </a>
                <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  แชร์
                </button>
                <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  ติดต่อสอบถาม
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">ข้อมูลเพิ่มเติม</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• คลิปไฮไลท์จากชุมชนบางลำพู</p>
                <p>• เนื้อหาคุณภาพและน่าสนใจ</p>
                <p>• รองรับการเล่นในเว็บไซต์</p>
                <p>• สามารถแชร์และติดตามได้</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Highlights Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ไฮไลท์อื่นๆ
            </h2>
            <p className="text-gray-600">
              สำรวจคลิปไฮไลท์อื่นๆ จากชุมชนบางลำพู
            </p>
          </div>

          <div className="text-center">
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
      </div>
    </div>
  );
}
