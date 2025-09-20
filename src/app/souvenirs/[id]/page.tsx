'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import SouvenirGallery from '@/components/SouvenirGallery';

interface Souvenir {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  price?: number;
  category?: string;
  material?: string;
  size?: string;
  weight?: string;
  origin?: string;
  createdAt: string;
}

export default function SouvenirDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [souvenir, setSouvenir] = useState<Souvenir | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchSouvenir(params.id as string);
    }
  }, [params.id]);

  const fetchSouvenir = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/souvenirs/${id}`);
      const data = await response.json();

      if (data.success) {
        setSouvenir(data.data);
      } else {
        setError(data.message || 'ไม่พบสินค้าที่ระลึก');
      }
    } catch (error) {
      console.error('Error fetching souvenir:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้าที่ระลึก');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดรายละเอียดสินค้า...</p>
        </div>
      </div>
    );
  }

  if (error || !souvenir) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบสินค้าที่ระลึก</h1>
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
              <span className="text-gray-900 font-medium">สินค้าที่ระลึก</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <SouvenirGallery images={souvenir.images} name={souvenir.name} />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {souvenir.name}
              </h1>
              {souvenir.category && (
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                  {souvenir.category}
                </span>
              )}
            </div>

            {/* Price */}
            {souvenir.price && (
              <div className="text-3xl font-bold text-green-600">
                ฿{souvenir.price.toLocaleString()}
              </div>
            )}

            {/* Description */}
            {souvenir.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">คำอธิบาย</h3>
                <p className="text-gray-700 leading-relaxed">
                  {souvenir.description}
                </p>
              </div>
            )}

            {/* Product Specifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">รายละเอียดสินค้า</h3>
              <div className="space-y-3">
                {souvenir.material && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">วัสดุ</span>
                    <span className="text-gray-600">{souvenir.material}</span>
                  </div>
                )}
                {souvenir.size && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">ขนาด</span>
                    <span className="text-gray-600">{souvenir.size}</span>
                  </div>
                )}
                {souvenir.weight && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">น้ำหนัก</span>
                    <span className="text-gray-600">{souvenir.weight}</span>
                  </div>
                )}
                {souvenir.origin && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">แหล่งผลิต</span>
                    <span className="text-gray-600">{souvenir.origin}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg">
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  สนใจซื้อ
                </button>
                <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  แชร์
                </button>
                <button className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
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
                <p>• สินค้าที่ระลึกจากชุมชนบางลำพู</p>
                <p>• ผลิตด้วยความใส่ใจและคุณภาพ</p>
                <p>• เหมาะสำหรับเป็นของฝากและของที่ระลึก</p>
                <p>• สนับสนุนเศรษฐกิจชุมชนท้องถิ่น</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              สินค้าที่ระลึกอื่นๆ
            </h2>
            <p className="text-gray-600">
              สำรวจสินค้าที่ระลึกอื่นๆ จากชุมชนบางลำพู
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/souvenirs"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              ดูสินค้าที่ระลึกทั้งหมด
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
