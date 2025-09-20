'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

export default function SouvenirsPage() {
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchSouvenirs();
  }, [selectedCategory]);

  const fetchSouvenirs = async () => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `/api/souvenirs?category=${selectedCategory}&limit=50`
        : '/api/souvenirs?limit=50';

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setSouvenirs(data.data);

        // Extract unique categories
        const uniqueCategories = [...new Set(data.data.map((s: Souvenir) => s.category).filter(Boolean))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching souvenirs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังโหลดสินค้าที่ระลึก...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              สินค้าที่ระลึก
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ของฝากและสินค้าที่ระลึกจากชุมชนบางลำพู ที่ผลิตด้วยความใส่ใจและคุณภาพ
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === ''
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              ทั้งหมด ({souvenirs.length})
            </button>
            {categories.map((category) => {
              const count = souvenirs.filter(s => s.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Souvenirs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {souvenirs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบสินค้าที่ระลึก</h2>
            <p className="text-gray-600 mb-6">
              {selectedCategory
                ? `ไม่พบสินค้าในหมวดหมู่ "${selectedCategory}"`
                : 'ยังไม่มีสินค้าที่ระลึกในขณะนี้'
              }
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              กลับหน้าแรก
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                แสดง {souvenirs.length} รายการ
                {selectedCategory && ` ในหมวดหมู่ "${selectedCategory}"`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {souvenirs.map((souvenir) => (
                <div key={souvenir._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <Link href={`/souvenirs/${souvenir._id}`}>
                    <div className="relative">
                      <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                        <img
                          src={souvenir.images[0]}
                          alt={souvenir.name}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>

                      {souvenir.category && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {souvenir.category}
                          </span>
                        </div>
                      )}

                      {souvenir.images.length > 1 && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-white text-gray-700 shadow">
                            +{souvenir.images.length - 1}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/souvenirs/${souvenir._id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-green-600 transition-colors">
                        {souvenir.name}
                      </h3>
                    </Link>

                    {souvenir.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {souvenir.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      {souvenir.price && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">ราคา</span>
                          <span className="text-lg font-bold text-green-600">
                            ฿{souvenir.price.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {souvenir.material && (
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 w-16">วัสดุ:</span>
                          <span className="text-gray-700">{souvenir.material}</span>
                        </div>
                      )}

                      {souvenir.size && (
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 w-16">ขนาด:</span>
                          <span className="text-gray-700">{souvenir.size}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        href={`/souvenirs/${souvenir._id}`}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium text-center"
                      >
                        <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        ดูรายละเอียด
                      </Link>

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
          </>
        )}
      </div>
    </div>
  );
}
