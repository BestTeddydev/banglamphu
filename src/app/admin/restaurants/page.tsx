'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  openingHours: {
    open: string;
    close: string;
  };
  contactInfo: string;
  priceRange: string;
  features: string[];
  tags: string[];
  rating: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminRestaurantsPage() {
  const { isAdmin } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/restaurants');
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      const data = await response.json();
      setRestaurants(data.restaurants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบร้านอาหารนี้?')) return;

    try {
      const response = await fetch(`/api/admin/restaurants/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchRestaurants();
      } else {
        alert('เกิดข้อผิดพลาดในการลบร้านอาหาร');
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      alert('เกิดข้อผิดพลาดในการลบร้านอาหาร');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/restaurants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchRestaurants();
      } else {
        alert('เกิดข้อผิดพลาดในการอัพเดทสถานะ');
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดทสถานะ');
    }
  };

  const getCategoryText = (category: string) => {
    const categories: { [key: string]: string } = {
      'thai': 'อาหารไทย',
      'international': 'อาหารนานาชาติ',
      'cafe': 'คาเฟ่',
      'street_food': 'อาหารข้างทาง',
      'fine_dining': 'อาหารหรู',
      'fast_food': 'ฟาสต์ฟู้ด',
      'seafood': 'อาหารทะเล',
      'other': 'อื่นๆ'
    };
    return categories[category] || 'อื่นๆ';
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || restaurant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            onClick={fetchRestaurants}
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
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/admin" className="hover:text-green-600">แอดมิน</Link>
            <span>›</span>
            <span className="text-gray-900">ร้านอาหาร</span>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">จัดการร้านอาหาร</h1>
              <p className="text-gray-600">จัดการข้อมูลร้านอาหารและเมนู</p>
            </div>
            <Link
              href="/admin/restaurants/create"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              เพิ่มร้านอาหารใหม่
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="ค้นหาร้านอาหาร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium bg-white shadow-sm hover:shadow-md focus:shadow-md"
          >
            <option value="">หมวดหมู่ทั้งหมด</option>
            <option value="thai">อาหารไทย</option>
            <option value="international">อาหารนานาชาติ</option>
            <option value="cafe">คาเฟ่</option>
            <option value="street_food">อาหารข้างทาง</option>
            <option value="fine_dining">อาหารหรู</option>
            <option value="fast_food">ฟาสต์ฟู้ด</option>
            <option value="seafood">อาหารทะเล</option>
            <option value="other">อื่นๆ</option>
          </select>
        </div>

        {/* Restaurants Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">ยังไม่มีร้านอาหาร</h3>
            <p className="text-gray-600 mb-4">เริ่มเพิ่มร้านอาหารแรกของคุณ</p>
            <Link
              href="/admin/restaurants/create"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              เพิ่มร้านอาหารใหม่
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={restaurant.images[0] || '/placeholder-restaurant.jpg'}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {restaurant.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      restaurant.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {restaurant.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {restaurant.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {getCategoryText(restaurant.category)}
                    </span>
                    <span className="text-yellow-600 font-medium">
                      {'$'.repeat(restaurant.priceRange.length)} • ⭐ {restaurant.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/restaurants/${restaurant._id}/menus`}
                        className="flex-1 bg-purple-600 text-white text-center py-2 px-4 rounded-lg hover:bg-purple-700 font-medium transition-colors duration-200"
                      >
                        จัดการเมนู
                      </Link>
                      <Link
                        href={`/admin/restaurants/${restaurant._id}/edit`}
                        className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200"
                      >
                        แก้ไข
                      </Link>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleActive(restaurant._id, restaurant.isActive)}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                          restaurant.isActive
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {restaurant.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                      </button>
                      <button
                        onClick={() => handleDelete(restaurant._id)}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 font-medium transition-colors duration-200"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}