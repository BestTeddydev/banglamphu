'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Menu {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  ingredients: string[];
  allergens: string[];
  isVegetarian: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  preparationTime: number;
  calories?: number;
  rating: number;
  order: number;
  restaurantId: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

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

export default function RestaurantMenusPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurant();
      fetchMenus();
    }
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`/api/admin/restaurants/${restaurantId}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const restaurantData = await response.json();
        setRestaurant(restaurantData);
      } else {
        setError('ไม่พบข้อมูลร้านอาหาร');
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลร้านอาหาร');
    }
  };

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/menus?restaurantId=${restaurantId}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setMenus(data.menus);
      } else {
        throw new Error('Failed to fetch menus');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (menuId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบเมนูนี้?')) return;

    try {
      const response = await fetch(`/api/admin/menus/${menuId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchMenus();
      } else {
        alert('เกิดข้อผิดพลาดในการลบเมนู');
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
      alert('เกิดข้อผิดพลาดในการลบเมนู');
    }
  };

  const toggleAvailability = async (menuId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/menus/${menuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });

      if (response.ok) {
        fetchMenus();
      } else {
        alert('เกิดข้อผิดพลาดในการอัพเดทสถานะ');
      }
    } catch (error) {
      console.error('Error updating menu:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดทสถานะ');
    }
  };

  const getCategoryText = (category: string) => {
    const categories: { [key: string]: string } = {
      'appetizer': 'อาหารเรียกน้ำย่อย',
      'main_course': 'อาหารจานหลัก',
      'dessert': 'ของหวาน',
      'beverage': 'เครื่องดื่ม',
      'soup': 'ซุป',
      'salad': 'สลัด',
      'side_dish': 'เครื่องเคียง',
      'other': 'อื่นๆ'
    };
    return categories[category] || 'อื่นๆ';
  };

  const filteredMenus = menus.filter(menu => {
    const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || menu.category === selectedCategory;
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'available' && menu.isAvailable) ||
                               (availabilityFilter === 'unavailable' && !menu.isAvailable);
    return matchesSearch && matchesCategory && matchesAvailability;
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
            onClick={() => {
              fetchRestaurant();
              fetchMenus();
            }}
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
            <Link href="/admin/restaurants" className="hover:text-green-600">ร้านอาหาร</Link>
            <span>›</span>
            <span className="text-gray-900">{restaurant?.name}</span>
            <span>›</span>
            <span className="text-gray-900">เมนู</span>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">เมนูอาหาร</h1>
              <p className="text-gray-600">{restaurant?.name}</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href={`/admin/restaurants/${restaurantId}/edit`}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                แก้ไขร้าน
              </Link>
              <Link
                href={`/admin/restaurants/${restaurantId}/menus/create`}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                เพิ่มเมนูใหม่
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="ค้นหาเมนู..."
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
            <option value="appetizer">อาหารเรียกน้ำย่อย</option>
            <option value="main_course">อาหารจานหลัก</option>
            <option value="dessert">ของหวาน</option>
            <option value="beverage">เครื่องดื่ม</option>
            <option value="soup">ซุป</option>
            <option value="salad">สลัด</option>
            <option value="side_dish">เครื่องเคียง</option>
            <option value="other">อื่นๆ</option>
          </select>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium bg-white shadow-sm hover:shadow-md focus:shadow-md"
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="available">พร้อมขาย</option>
            <option value="unavailable">ไม่พร้อมขาย</option>
          </select>
        </div>

        {/* Menus Grid */}
        {filteredMenus.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">ยังไม่มีเมนู</h3>
            <p className="text-gray-600 mb-4">เริ่มเพิ่มเมนูแรกของคุณ</p>
            <Link
              href={`/admin/restaurants/${restaurantId}/menus/create`}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              เพิ่มเมนูใหม่
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenus.map((menu) => (
              <div key={menu._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={menu.images[0] || '/placeholder-menu.jpg'}
                    alt={menu.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {menu.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      menu.isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {menu.isAvailable ? 'พร้อมขาย' : 'ไม่พร้อมขาย'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {menu.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {getCategoryText(menu.category)}
                    </span>
                    <span className="text-green-600 font-bold text-lg">
                      ฿{menu.price.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Menu Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {menu.preparationTime} นาที
                    </div>
                    {menu.calories && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {menu.calories} แคลอรี่
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      {menu.isVegetarian && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          มังสวิรัติ
                        </span>
                      )}
                      {menu.isSpicy && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          เผ็ด
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/restaurants/${restaurantId}/menus/${menu._id}/edit`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200"
                    >
                      แก้ไข
                    </Link>
                    <button
                      onClick={() => toggleAvailability(menu._id, menu.isAvailable)}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                        menu.isAvailable
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {menu.isAvailable ? 'ปิดขาย' : 'เปิดขาย'}
                    </button>
                    <button
                      onClick={() => handleDelete(menu._id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 font-medium transition-colors duration-200"
                    >
                      ลบ
                    </button>
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
