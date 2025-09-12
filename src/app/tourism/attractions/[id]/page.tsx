'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Attraction {
  _id: string;
  name: string;
  description: string;
  images: string[];
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  category: string;
  openingHours: {
    open: string;
    close: string;
  };
  admissionFee: number;
  contactInfo: string;
  features: string[];
  tags: string[];
}

export default function AttractionDetailPage() {
  const params = useParams();
  const attractionId = params.id as string;
  
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (attractionId) {
      fetchAttraction();
    }
  }, [attractionId]);

  const fetchAttraction = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/attractions/${attractionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attraction');
      }
      const data = await response.json();
      setAttraction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'temple': return 'bg-blue-100 text-blue-800';
      case 'museum': return 'bg-purple-100 text-purple-800';
      case 'market': return 'bg-green-100 text-green-800';
      case 'park': return 'bg-orange-100 text-orange-800';
      case 'historical': return 'bg-red-100 text-red-800';
      case 'cultural': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'temple': return 'วัด';
      case 'museum': return 'พิพิธภัณฑ์';
      case 'market': return 'ตลาด';
      case 'park': return 'สวนสาธารณะ';
      case 'historical': return 'สถานที่ประวัติศาสตร์';
      case 'cultural': return 'สถานที่วัฒนธรรม';
      default: return 'อื่นๆ';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error || !attraction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบข้อมูล</h2>
          <p className="text-gray-600 mb-4">{error || 'ไม่พบแหล่งท่องเที่ยวที่ต้องการ'}</p>
          <Link href="/tourism/attractions" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            กลับไปยังรายการแหล่งท่องเที่ยว
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/tourism" className="hover:text-green-600">ท่องเที่ยว</Link>
          <span>›</span>
          <Link href="/tourism/attractions" className="hover:text-green-600">แหล่งท่องเที่ยว</Link>
          <span>›</span>
          <span className="text-gray-900">{attraction.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(attraction.category)}`}>
                {getCategoryText(attraction.category)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">
                {attraction.admissionFee === 0 ? 'ฟรี' : `฿${attraction.admissionFee}`}
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{attraction.name}</h1>
          <p className="text-xl text-gray-600">{attraction.description}</p>
        </div>

        {/* Images Gallery */}
        {attraction.images && attraction.images.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {attraction.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`${attraction.name} - รูปที่ ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Location */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">ข้อมูลสถานที่</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">ที่อยู่</h3>
                    <p className="text-gray-600">{attraction.location.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">เวลาเปิด-ปิด</h3>
                    <p className="text-gray-600">เปิด {attraction.openingHours.open} - {attraction.openingHours.close}</p>
                  </div>
                </div>

                {attraction.contactInfo && (
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">ข้อมูลติดต่อ</h3>
                      <p className="text-gray-600">{attraction.contactInfo}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {attraction.features && attraction.features.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">คุณสมบัติเด่น</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attraction.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Tags & Actions */}
          <div className="space-y-6">
            {/* Tags */}
            {attraction.tags && attraction.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">แท็ก</h3>
                <div className="flex flex-wrap gap-2">
                  {attraction.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">การดำเนินการ</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                  เพิ่มในรายการโปรด
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  แชร์
                </button>
                <Link 
                  href="/tourism/attractions" 
                  className="block w-full px-4 py-2 text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  กลับไปยังรายการ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
