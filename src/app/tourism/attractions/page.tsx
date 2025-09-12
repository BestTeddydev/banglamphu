'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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

export default function AttractionsPage() {
  const [attractionsData, setAttractionsData] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchAttractions();
  }, []);

  const fetchAttractions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/attractions');
      if (!response.ok) {
        throw new Error('Failed to fetch attractions');
      }
      const data = await response.json();
      setAttractionsData(data.attractions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredAttractions = selectedCategory === 'all' 
    ? attractionsData 
    : attractionsData.filter(attraction => attraction.category === selectedCategory);


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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/tourism" className="hover:text-green-600">ท่องเที่ยว</Link>
            <span>›</span>
            <span className="text-gray-900">แหล่งท่องเที่ยว</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">แหล่งท่องเที่ยวบางลำพู</h1>
          <p className="text-gray-600">สำรวจสถานที่ท่องเที่ยวที่น่าสนใจในชุมชนบางลำพู</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedCategory === 'all' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              ทั้งหมด
            </button>
            <button 
              onClick={() => setSelectedCategory('temple')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedCategory === 'temple' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              วัด
            </button>
            <button 
              onClick={() => setSelectedCategory('museum')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedCategory === 'museum' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              พิพิธภัณฑ์
            </button>
            <button 
              onClick={() => setSelectedCategory('market')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedCategory === 'market' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              ตลาด
            </button>
            <button 
              onClick={() => setSelectedCategory('park')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedCategory === 'park' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              สวนสาธารณะ
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">กำลังโหลดข้อมูล...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-2">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">เกิดข้อผิดพลาด</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button 
                onClick={fetchAttractions}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                ลองใหม่
              </button>
            </div>
          </div>
        )}

        {/* Attractions Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttractions.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">ไม่พบข้อมูล</h3>
                <p className="text-gray-600">ไม่พบแหล่งท่องเที่ยวในหมวดหมู่นี้</p>
              </div>
            ) : (
              filteredAttractions.map((attraction) => (
                <article key={attraction._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 relative overflow-hidden">
                {attraction.images && attraction.images.length > 0 ? (
                  <img 
                    src={attraction.images[0]} 
                    alt={attraction.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(attraction.category)}`}>
                    {getCategoryText(attraction.category)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {attraction.admissionFee === 0 ? 'ฟรี' : `฿${attraction.admissionFee}`}
                  </span>
                </div>
                
                <h2 className="text-lg font-semibold mb-3 line-clamp-2">
                  <Link href={`/tourism/attractions/${attraction._id}`} className="hover:text-green-600 transition-colors duration-200">
                    {attraction.name}
                  </Link>
                </h2>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {attraction.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {attraction.location.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    เปิด {attraction.openingHours.open} - {attraction.openingHours.close}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {attraction.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/tourism/attractions/${attraction._id}`} className="text-green-600 hover:text-green-800 font-medium text-sm">
                    ดูรายละเอียด →
                  </Link>
                </div>
              </div>
            </article>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="px-3 py-2 bg-green-600 text-white rounded-lg">1</button>
            <button className="px-3 py-2 text-gray-700 hover:text-gray-900">2</button>
            <button className="px-3 py-2 text-gray-700 hover:text-gray-900">3</button>
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
