'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
}

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

export default function RestaurantDetailPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedMenuCategory, setSelectedMenuCategory] = useState('');

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurant();
      fetchMenus();
    }
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/restaurants/${restaurantId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant');
      }
      const data = await response.json();
      setRestaurant(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenus = async () => {
    try {
      setMenuLoading(true);
      const response = await fetch(`/api/menus?restaurantId=${restaurantId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch menus');
      }
      const data = await response.json();
      setMenus(data.menus);
    } catch (err) {
      console.error('Error fetching menus:', err);
    } finally {
      setMenuLoading(false);
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

  const getPriceRangeText = (priceRange: string) => {
    const priceRanges: { [key: string]: string } = {
      '$': 'ถูก',
      '$$': 'ปานกลาง',
      '$$$': 'แพง',
      '$$$$': 'แพงมาก'
    };
    return priceRanges[priceRange] || 'ไม่ระบุ';
  };

  const getMenuCategoryText = (category: string) => {
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
    if (!selectedMenuCategory) return true;
    return menu.category === selectedMenuCategory;
  });

  const menuCategories = [...new Set(menus.map(menu => menu.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลร้านอาหาร...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบร้านอาหาร</h2>
          <p className="text-gray-600 mb-4">{error || 'ร้านอาหารที่คุณกำลังมองหาไม่มีอยู่'}</p>
          <Link
            href="/tourism/restaurants"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            กลับไปยังรายการร้านอาหาร
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
          <Link href="/tourism/restaurants" className="hover:text-green-600">ร้านอาหาร</Link>
          <span>›</span>
          <span className="text-gray-900">{restaurant.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={restaurant.images[selectedImageIndex] || '/placeholder-restaurant.jpg'}
                alt={restaurant.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            
            {restaurant.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {restaurant.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-w-16 aspect-h-9 rounded-lg overflow-hidden ${
                      selectedImageIndex === index ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${restaurant.name} ${index + 1}`}
                      className="w-full h-20 object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {getCategoryText(restaurant.category)}
                </span>
                <div className="flex items-center text-yellow-500">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                  <span className="ml-1 font-medium">{restaurant.rating.toFixed(1)}</span>
                </div>
                <span className="text-green-600 font-medium">
                  {restaurant.priceRange} • {getPriceRangeText(restaurant.priceRange)}
                </span>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">{restaurant.description}</p>
            </div>

            {/* Opening Hours */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                เวลาเปิด-ปิด
              </h3>
              <p className="text-gray-700">
                {restaurant.openingHours.open} - {restaurant.openingHours.close}
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center mt-2">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                ที่อยู่
              </h3>
              <p className="text-gray-700 mb-2">{restaurant.location.address}</p>
              {restaurant.location.coordinates.lat !== 0 && restaurant.location.coordinates.lng !== 0 && (
                <a
                  href={`https://www.google.com/maps?q=${restaurant.location.coordinates.lat},${restaurant.location.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  ดูใน Google Maps
                </a>
              )}
              {restaurant.contactInfo && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  ข้อมูลติดต่อ
                </h3>
                <p className="text-gray-700">{restaurant.contactInfo}</p>
              </div>
            )}
            </div>


            {/* Features */}
            {restaurant.features && restaurant.features.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  คุณสมบัติเด่น
                </h3>
                <div className="flex flex-wrap gap-2">
                  {restaurant.features.map((feature, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {restaurant.tags && restaurant.tags.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  แท็ก
                </h3>
                <div className="flex flex-wrap gap-2">
                  {restaurant.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Menu Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                เมนูอาหาร
              </h3>
              
              {menuLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">กำลังโหลดเมนู...</p>
                </div>
              ) : menus.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                  </div>
                  <p className="text-gray-600">ยังไม่มีเมนูอาหาร</p>
                </div>
              ) : (
                <>
                  {/* Menu Category Filter */}
                  {menuCategories.length > 1 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedMenuCategory('')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            selectedMenuCategory === ''
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          ทั้งหมด
                        </button>
                        {menuCategories.map((category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedMenuCategory(category)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                              selectedMenuCategory === category
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {getMenuCategoryText(category)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Menu Items */}
                  <div className="space-y-4">
                    {filteredMenus.map((menu) => (
                      <div key={menu._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start space-x-4">
                          {/* Menu Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={menu.images[0] || '/placeholder-menu.jpg'}
                              alt={menu.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          </div>
                          
                          {/* Menu Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">{menu.name}</h4>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{menu.description}</p>
                                
                                {/* Menu Tags */}
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {getMenuCategoryText(menu.category)}
                                  </span>
                                  {menu.isVegetarian && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                      มังสวิรัติ
                                    </span>
                                  )}
                                  {menu.isSpicy && (
                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                      เผ็ด
                                    </span>
                                  )}
                                </div>
                                
                                {/* Menu Info */}
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {menu.preparationTime} นาที
                                  </div>
                                  {menu.calories && (
                                    <div className="flex items-center">
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                      </svg>
                                      {menu.calories} แคลอรี่
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Price */}
                              <div className="text-right">
                                <div className="text-xl font-bold text-green-600">
                                  ฿{menu.price.toLocaleString()}
                                </div>
                                {menu.rating > 0 && (
                                  <div className="flex items-center text-yellow-500 text-sm">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                    </svg>
                                    <span className="ml-1">{menu.rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/tourism/restaurants"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            กลับไปยังรายการร้านอาหาร
          </Link>
        </div>
      </div>
    </div>
  );
}
