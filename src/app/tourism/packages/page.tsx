'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Package {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  maxParticipants: number;
  images: string[];
  category: string;
  difficulty: string;
  rating: number;
  reviewCount: number;
  tourDates: {
    date: Date;
    startTime: string;
    endTime: string;
    availableSlots: number;
  }[];
}

export default function PackagesPage() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await fetch(`/api/packages?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'ไม่สามารถโหลดข้อมูลได้');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchPackages();
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'ง่าย';
      case 'moderate': return 'ปานกลาง';
      case 'hard': return 'ยาก';
      default: return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <button
            onClick={fetchPackages}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">แพ็คเกจทัวร์</h1>
          <p className="text-gray-600">เลือกแพ็คเกจทัวร์ที่คุณสนใจ</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                ค้นหา
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาแพ็คเกจ..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                หมวดหมู่
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">ทั้งหมด</option>
                <option value="วัฒนธรรม">วัฒนธรรม</option>
                <option value="ธรรมชาติ">ธรรมชาติ</option>
                <option value="อาหาร">อาหาร</option>
                <option value="ประวัติศาสตร์">ประวัติศาสตร์</option>
                <option value="ผจญภัย">ผจญภัย</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
              >
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {packages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบแพ็คเกจทัวร์</h3>
            <p className="text-gray-600">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                {/* Package Image */}
                <div className="relative h-48">
                  <img
                    src={pkg.images[0] || '/placeholder-package.jpg'}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                      {pkg.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(pkg.difficulty)}`}>
                      {getDifficultyText(pkg.difficulty)}
                    </span>
                  </div>
                </div>

                {/* Package Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {pkg.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(pkg.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {pkg.rating.toFixed(1)} ({pkg.reviewCount} รีวิว)
                    </span>
                  </div>

                  {/* Tour Dates */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">วันที่จัดทัวร์</h4>
                    <div className="space-y-1">
                      {pkg.tourDates.slice(0, 3).map((tourDate, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {formatDate(tourDate.date)} - {tourDate.startTime} ถึง {tourDate.endTime}
                          <span className="ml-2 text-green-600 font-medium">
                            (เหลือ {tourDate.availableSlots} ที่)
                          </span>
                        </div>
                      ))}
                      {pkg.tourDates.length > 3 && (
                        <div className="text-sm text-gray-500">
                          และอีก {pkg.tourDates.length - 3} วันที่
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price and Duration */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-green-600">
                        ฿{pkg.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">/คน</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {pkg.duration} ชั่วโมง
                    </div>
                  </div>

                  {/* Book Button */}
                  <Link
                    href={`/tourism/packages/${pkg._id}`}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors duration-200 text-center block"
                  >
                    ดูรายละเอียดและจอง
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}