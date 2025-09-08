'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  cuisine: string[];
  priceRange: string;
  location: {
    address: string;
  };
  images: string[];
  isActive: boolean;
  rating: number;
  reviewCount: number;
  averagePrice: number;
  createdAt: string;
}

export default function RestaurantsPage() {
  const { user, isAdmin } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchRestaurants();
    }
  }, [isAdmin]);

  const fetchRestaurants = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCuisine) params.append('cuisine', selectedCuisine);
      
      const response = await fetch(`/api/admin/restaurants?${params}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data.restaurants);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchRestaurants();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบร้านอาหารนี้?')) return;
    
    try {
      const response = await fetch(`/api/admin/restaurants/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setRestaurants(restaurants.filter(restaurant => restaurant._id !== id));
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  const getPriceRangeText = (priceRange: string) => {
    switch (priceRange) {
      case 'budget': return 'ประหยัด';
      case 'moderate': return 'ปานกลาง';
      case 'expensive': return 'แพง';
      default: return priceRange;
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
          <p className="text-gray-600 mb-4">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
          <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">จัดการร้านอาหาร</h1>
              <p className="text-gray-600 mt-1">จัดการข้อมูลร้านอาหารในชุมชนบางลำพู</p>
            </div>
            <Link
              href="/admin/restaurants/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              เพิ่มร้านอาหาร
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ค้นหา
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อหรือคำอธิบาย"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภทอาหาร
              </label>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">ทั้งหมด</option>
                <option value="อาหารไทย">อาหารไทย</option>
                <option value="อาหารจีน">อาหารจีน</option>
                <option value="อาหารญี่ปุ่น">อาหารญี่ปุ่น</option>
                <option value="อาหารเกาหลี">อาหารเกาหลี</option>
                <option value="อาหารตะวันตก">อาหารตะวันตก</option>
                <option value="ขนมหวาน">ขนมหวาน</option>
                <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        {/* Restaurants List */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">กำลังโหลด...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รูปภาพ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่อร้าน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ประเภทอาหาร
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ราคา
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ที่อยู่
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      คะแนน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {restaurants.map((restaurant) => (
                    <tr key={restaurant._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-12 w-12 rounded-lg overflow-hidden">
                          {restaurant.images[0] ? (
                            <img
                              src={restaurant.images[0]}
                              alt={restaurant.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {restaurant.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {restaurant.cuisine.slice(0, 2).map((cuisine, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {cuisine}
                            </span>
                          ))}
                          {restaurant.cuisine.length > 2 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              +{restaurant.cuisine.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          restaurant.priceRange === 'budget' ? 'bg-green-100 text-green-800' :
                          restaurant.priceRange === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {getPriceRangeText(restaurant.priceRange)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {restaurant.location.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">{restaurant.rating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500 ml-1">({restaurant.reviewCount})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          restaurant.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {restaurant.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/restaurants/${restaurant._id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            แก้ไข
                          </Link>
                          <button
                            onClick={() => handleDelete(restaurant._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {restaurants.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  ไม่พบร้านอาหาร
                </div>
              )}
            </div>
          )}
        </div>

        {/* Back to Admin */}
        <div className="mt-8 text-center">
          <Link
            href="/admin"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            กลับไประบบจัดการ
          </Link>
        </div>
      </div>
    </div>
  );
}
