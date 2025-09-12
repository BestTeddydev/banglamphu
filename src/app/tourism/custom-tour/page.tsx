'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import GoogleMap from '@/components/GoogleMap';

interface Attraction {
  _id: string;
  name: string;
  description: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  } | string;
  category: string;
  images?: string[];
  openingHours?: string | {
    open: string;
    close: string;
  };
  contact?: string;
}

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  } | string;
  category: string;
  cuisine: string;
  images?: string[];
  openingHours?: string;
  contact?: string;
  priceRange?: string;
}

interface Menu {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  cuisine: string;
  restaurantId: {
    _id: string;
    name: string;
    location: {
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    } | string;
  };
  images?: string[];
  ingredients?: string[];
  allergens?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

interface BookmarkedPlace {
  id: string;
  type: 'attraction' | 'restaurant' | 'menu';
  name: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  description?: string;
  price?: number;
  category?: string;
  cuisine?: string;
}

export default function CustomTourPage() {
  const { user } = useAuth();
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttractions, setSelectedAttractions] = useState<string[]>([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([]);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [bookmarkedPlaces, setBookmarkedPlaces] = useState<BookmarkedPlace[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [activeTab, setActiveTab] = useState<'attractions' | 'restaurants' | 'menus'>('attractions');

  useEffect(() => {
    fetchData();
  }, [searchTerm, selectedCategory, selectedCuisine]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [attractionsRes, restaurantsRes, menusRes] = await Promise.all([
        fetch(`/api/attractions?search=${searchTerm}&category=${selectedCategory}`, {
          credentials: 'include'
        }),
        fetch(`/api/restaurants?search=${searchTerm}&category=${selectedCategory}&cuisine=${selectedCuisine}`, {
          credentials: 'include'
        }),
        fetch(`/api/menus?search=${searchTerm}&category=${selectedCategory}&cuisine=${selectedCuisine}`, {
          credentials: 'include'
        })
      ]);
      
      if (attractionsRes.ok) {
        const attractionsData = await attractionsRes.json();
        setAttractions(attractionsData.attractions || []);
      }
      
      if (restaurantsRes.ok) {
        const restaurantsData = await restaurantsRes.json();
        setRestaurants(restaurantsData.restaurants || []);
      }
      
      if (menusRes.ok) {
        const menusData = await menusRes.json();
        setMenus(menusData.menus || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  const handleAttractionToggle = (attractionId: string) => {
    setSelectedAttractions(prev => 
      prev.includes(attractionId) 
        ? prev.filter(id => id !== attractionId)
        : [...prev, attractionId]
    );
  };

  const handleRestaurantToggle = (restaurantId: string) => {
    setSelectedRestaurants(prev => 
      prev.includes(restaurantId) 
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const handleMenuToggle = (menuId: string) => {
    setSelectedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleBookmark = (place: BookmarkedPlace) => {
    setBookmarkedPlaces(prev => {
      const exists = prev.find(p => p.id === place.id);
      if (exists) {
        return prev.filter(p => p.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };

  const openGoogleMaps = (coordinates: { lat: number; lng: number }, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}&query_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  // Make openGoogleMaps available globally for InfoWindow
  useEffect(() => {
    (window as any).openGoogleMaps = (lat: number, lng: number, name: string) => {
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
      window.open(url, '_blank');
    };
  }, []);

  const selectedPlaces: any[] = [
    ...attractions?.filter(attraction => selectedAttractions.includes(attraction._id)),
    ...restaurants?.filter(restaurant => selectedRestaurants.includes(restaurant._id)),
    ...menus?.filter(menu => selectedMenus.includes(menu._id))
  ];

  // Convert selected places to map markers
  const mapMarkers = selectedPlaces.map(place => {
    let coordinates;
    let type: 'attraction' | 'restaurant' | 'menu';
    let description, images, price, category, cuisine;
    
    if (place.restaurantId) {
      // This is a menu
      type = 'menu';
      coordinates = typeof place.restaurantId.location === 'object' 
        ? place.restaurantId.location?.coordinates 
        : null;
      description = place.description;
      images = place.images;
      price = place.price;
      category = place.category;
      cuisine = place.cuisine;
    } else if (place.category && place.cuisine) {
      // This is a restaurant
      type = 'restaurant';
      coordinates = typeof place.location === 'object' 
        ? place.location?.coordinates 
        : null;
      description = place.description;
      images = place.images;
      category = place.category;
      cuisine = place.cuisine;
    } else {
      // This is an attraction
      type = 'attraction';
      coordinates = typeof place.location === 'object' 
        ? place.location?.coordinates 
        : null;
      description = place.description;
      images = place.images;
      category = place.category;
    }

    return {
      id: place._id,
      name: place.name,
      description,
      images,
      coordinates: coordinates || { lat: 0, lng: 0 },
      type,
      price,
      category,
      cuisine
    };
  }).filter(marker => marker.coordinates.lat !== 0 && marker.coordinates.lng !== 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/tourism" className="hover:text-green-600">ท่องเที่ยว</Link>
            <span>›</span>
            <span className="text-gray-900">ทัวร์แบบกำหนดเอง</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">สร้างทัวร์แบบกำหนดเอง</h1>
          <p className="text-gray-600">เลือกแหล่งท่องเที่ยว ร้านอาหาร และเมนูอาหารที่คุณสนใจ เพื่อสร้างทัวร์ของคุณเอง</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาสถานที่..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">ทั้งหมด</option>
                <option value="historical">ประวัติศาสตร์</option>
                <option value="cultural">วัฒนธรรม</option>
                <option value="nature">ธรรมชาติ</option>
                <option value="shopping">ช้อปปิ้ง</option>
                <option value="entertainment">บันเทิง</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทอาหาร</label>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">ทั้งหมด</option>
                <option value="thai">อาหารไทย</option>
                <option value="chinese">อาหารจีน</option>
                <option value="japanese">อาหารญี่ปุ่น</option>
                <option value="korean">อาหารเกาหลี</option>
                <option value="western">อาหารตะวันตก</option>
                <option value="dessert">ของหวาน</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedCuisine('');
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                รีเซ็ต
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('attractions')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'attractions'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              แหล่งท่องเที่ยว ({attractions.length})
            </button>
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'restaurants'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ร้านอาหาร ({restaurants.length})
            </button>
            <button
              onClick={() => setActiveTab('menus')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'menus'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              เมนูอาหาร ({menus.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={()=>fetchData()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              ลองใหม่
            </button>
          </div>
        ) 
        : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Places List */}
            <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeTab === 'attractions' && 'แหล่งท่องเที่ยว'}
                    {activeTab === 'restaurants' && 'ร้านอาหาร'}
                    {activeTab === 'menus' && 'เมนูอาหาร'}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowBookmarks(!showBookmarks)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        showBookmarks
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Bookmarks ({bookmarkedPlaces.length})
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {activeTab === 'attractions' && attractions?.map((attraction) => (
                    <div key={attraction?._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start space-x-4">
                        <img
                          src={(attraction?.images && attraction?.images[0]) || '/placeholder-attraction.jpg'}
                          alt={attraction.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{attraction?.name}</h3>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{attraction?.description}</p>
                              <p className="text-gray-500 text-sm mb-2">{typeof attraction?.location === 'object' ? attraction.location?.address : attraction.location}</p>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  {attraction?.category}
                                </div>
                                {attraction?.openingHours && (
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {typeof attraction?.openingHours === 'object' 
                                      ? `${attraction.openingHours?.open} - ${attraction.openingHours?.close}`
                                      : attraction.openingHours}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end space-y-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleAttractionToggle(attraction?._id)}
                                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    selectedAttractions.includes(attraction?._id)
                                      ? 'bg-green-600 text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  {selectedAttractions.includes(attraction?._id) ? 'เลือกแล้ว' : 'เลือก'}
                                </button>
                                <button
                                  onClick={() => handleBookmark({
                                    id: attraction?._id,
                                    type: 'attraction',
                                    name: attraction?.name,
                                    location: typeof attraction.location === 'object' ? attraction.location?.address : attraction.location,
                                    coordinates: typeof attraction.location === 'object' ? attraction.location?.coordinates : undefined,
                                    description: attraction?.description,
                                    category: attraction?.category
                                  })}
                                  className={`p-2 rounded-lg transition-colors duration-200 ${
                                    bookmarkedPlaces.find(p => p.id === attraction?._id)
                                      ? 'bg-yellow-100 text-yellow-600'
                                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                  }`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                  </svg>
                                </button>
                                {typeof attraction.location === 'object' && attraction.location?.coordinates && (
                                  <button
                                    onClick={() => openGoogleMaps((attraction?.location as any).coordinates!, attraction?.name)}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {activeTab === 'restaurants' && restaurants.map((restaurant) => (
                    <div key={restaurant._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start space-x-4">
                        <img
                          src={(restaurant.images && restaurant.images[0]) || '/placeholder-restaurant.jpg'}
                          alt={restaurant.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{restaurant.description}</p>
                              <p className="text-gray-500 text-sm mb-2">{typeof restaurant.location === 'object' ? restaurant.location?.address : restaurant.location}</p>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  {restaurant.category}
                                </div>
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                                  </svg>
                                  {restaurant.cuisine}
                                </div>
                                {restaurant.priceRange && (
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    {restaurant.priceRange}
                                  </div>
                                )}
              </div>
            </div>

                            <div className="flex flex-col items-end space-y-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleRestaurantToggle(restaurant._id)}
                                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    selectedRestaurants.includes(restaurant._id)
                                      ? 'bg-green-600 text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  {selectedRestaurants.includes(restaurant._id) ? 'เลือกแล้ว' : 'เลือก'}
                                </button>
                                <button
                                  onClick={() => handleBookmark({
                                    id: restaurant._id,
                                    type: 'restaurant',
                                    name: restaurant.name,
                                    location: typeof restaurant.location === 'object' ? restaurant.location?.address : restaurant.location,
                                    coordinates: typeof restaurant.location === 'object' ? restaurant.location?.coordinates : undefined,
                                    description: restaurant.description,
                                    category: restaurant.category,
                                    cuisine: restaurant.cuisine
                                  })}
                                  className={`p-2 rounded-lg transition-colors duration-200 ${
                                    bookmarkedPlaces.find(p => p.id === restaurant._id)
                                      ? 'bg-yellow-100 text-yellow-600'
                                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                  }`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                  </svg>
                                </button>
                                {typeof restaurant.location === 'object' && restaurant.location?.coordinates && (
                                  <button
                                    onClick={() => openGoogleMaps((restaurant.location as any).coordinates!, restaurant?.name)}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {activeTab === 'menus' && menus.map((menu) => (
                    <div key={menu._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start space-x-4">
                        <img
                          src={(menu.images && menu.images[0]) || '/placeholder-menu.jpg'}
                          alt={menu.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{menu.name}</h3>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{menu.description}</p>
                              <p className="text-gray-500 text-sm mb-2">{menu.restaurantId.name} - {typeof menu.restaurantId.location === 'object' ? menu.restaurantId.location?.address : menu.restaurantId.location}</p>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  {menu.category}
                                </div>
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                                  </svg>
                                  {menu.cuisine}
                                </div>
                                {menu.isVegetarian && (
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    มังสวิรัติ
                                  </div>
                                )}
                                {menu.isSpicy && (
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                    </svg>
                                    เผ็ด
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end space-y-2">
                              <div className="text-2xl font-bold text-green-600 mb-2">
                                ฿{menu.price.toLocaleString()}
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleMenuToggle(menu._id)}
                                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    selectedMenus.includes(menu._id)
                                      ? 'bg-green-600 text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  {selectedMenus.includes(menu._id) ? 'เลือกแล้ว' : 'เลือก'}
                                </button>
                                <button
                                  onClick={() => handleBookmark({
                                    id: menu._id,
                                    type: 'menu',
                                    name: menu.name,
                                    location: typeof menu.restaurantId.location === 'object' ? menu.restaurantId.location?.address : menu.restaurantId.location,
                                    coordinates: typeof menu.restaurantId.location === 'object' ? menu.restaurantId.location?.coordinates : undefined,
                                    description: menu.description,
                                    price: menu.price,
                                    category: menu.category,
                                    cuisine: menu.cuisine
                                  })}
                                  className={`p-2 rounded-lg transition-colors duration-200 ${
                                    bookmarkedPlaces.find(p => p.id === menu._id)
                                      ? 'bg-yellow-100 text-yellow-600'
                                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                  }`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                  </svg>
                                </button>
                                {typeof menu.restaurantId.location === 'object' && menu.restaurantId.location?.coordinates && (
                                  <button
                                    onClick={() => openGoogleMaps((menu.restaurantId.location as any).coordinates!, menu.restaurantId?.name)}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowMap(true)}
                disabled={selectedPlaces.length === 0}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                ดูแผนที่
              </button>
              <button
                onClick={() => setShowBookmarks(!showBookmarks)}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors duration-200"
              >
                {showBookmarks ? 'ซ่อน Bookmarks' : 'ดู Bookmarks'} ({bookmarkedPlaces.length})
              </button>
              <button
                onClick={() => {
                  setSelectedAttractions([]);
                  setSelectedRestaurants([]);
                  setSelectedMenus([]);
                  setShowMap(false);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                รีเซ็ต
              </button>
            </div>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">สรุปทัวร์ของคุณ</h3>
              
              {selectedPlaces.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-gray-500">ยังไม่ได้เลือกสถานที่</p>
                    <p className="text-sm text-gray-400">เลือกแหล่งท่องเที่ยว ร้านอาหาร และเมนูอาหารเพื่อสร้างทัวร์ของคุณ</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">สถานที่ที่เลือก ({selectedPlaces.length})</h4>
                    <div className="space-y-2">
                        {selectedPlaces?.map((place, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-gray-700">{place.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">ข้อมูลทัวร์</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>แหล่งท่องเที่ยว: {selectedAttractions.length} แห่ง</div>
                      <div>ร้านอาหาร: {selectedRestaurants.length} ร้าน</div>
                        <div>เมนูอาหาร: {selectedMenus.length} เมนู</div>
                      <div>ระยะเวลาโดยประมาณ: {selectedPlaces.length * 1.5} ชั่วโมง</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">คำแนะนำ</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• เริ่มต้นจากสถานที่ที่อยู่ใกล้กัน</li>
                      <li>• วางแผนเวลาให้เหมาะสม</li>
                      <li>• เตรียมเงินสดสำหรับค่าใช้จ่าย</li>
                        <li>• ตรวจสอบเวลาเปิด-ปิดของสถานที่</li>
                    </ul>
                  </div>
                </div>
              )}

                {/* Bookmarks Section */}
                {showBookmarks && (
                  <div className="mt-6 border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Bookmarks ({bookmarkedPlaces.length})</h4>
                    {bookmarkedPlaces.length === 0 ? (
                      <div className="text-center py-4">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <p className="text-gray-500 text-sm">ยังไม่มี bookmarks</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookmarkedPlaces.map((place, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <div className={`w-3 h-3 rounded-full mr-2 ${
                                    place.type === 'attraction' ? 'bg-red-500' :
                                    place.type === 'restaurant' ? 'bg-teal-500' : 'bg-blue-500'
                                  }`}></div>
                                  <h4 className="text-lg font-semibold text-gray-900">{place.name}</h4>
                                </div>
                                
                                <div className="text-sm text-gray-600 mb-2">
                                  {place.type === 'attraction' ? 'แหล่งท่องเที่ยว' :
                                   place.type === 'restaurant' ? 'ร้านอาหาร' : 'เมนูอาหาร'}
                                </div>

                                {place.description && (
                                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{place.description}</p>
                                )}

                                <div className="text-sm text-gray-500 mb-2">
                                  📍 {typeof place.location === 'string' ? place.location : (place.location as any)?.address || 'ไม่ระบุสถานที่'}
                                </div>

                                {place.price && (
                                  <div className="text-sm font-semibold text-green-600 mb-2">
                                    💰 ฿{place.price.toLocaleString()}
                                  </div>
                                )}

                                {place.category && (
                                  <div className="flex items-center text-xs text-gray-500 mb-2">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {place.category}
                                  </div>
                                )}

                                {place.cuisine && (
                                  <div className="flex items-center text-xs text-gray-500 mb-2">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                                    </svg>
                                    {place.cuisine}
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col items-end space-y-2 ml-4">
                                {place.coordinates && (
                                  <button
                                    onClick={() => openGoogleMaps(place.coordinates!, place.name)}
                                    className="flex items-center px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    เปิดแผนที่
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => handleBookmark(place)}
                                  className="flex items-center px-3 py-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors duration-200 text-sm font-medium"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                  </svg>
                                  ลบออก
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
        }

        {/* Map Section */}
        {showMap && mapMarkers.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">แผนที่ตำแหน่งสถานที่</h3>
                <button
                  onClick={() => setShowMap(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Map Legend */}
              <div className="flex items-center space-x-6 mb-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>แหล่งท่องเที่ยว</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
                  <span>ร้านอาหาร</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>เมนูอาหาร</span>
                </div>
              </div>

              {/* Google Map */}
              <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
                <GoogleMap 
                  markers={mapMarkers}
                  center={{
                    lat: 13.7563,
                    lng: 100.5018
                  }}
                  zoom={13}
                />
              </div>

              {/* Selected Places List */}
              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">สถานที่ที่เลือก ({mapMarkers.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mapMarkers.map((marker, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        marker.type === 'attraction' ? 'bg-red-500' :
                        marker.type === 'restaurant' ? 'bg-teal-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{marker.name}</div>
                        <div className="text-xs text-gray-500">
                          {marker.type === 'attraction' ? 'แหล่งท่องเที่ยว' :
                           marker.type === 'restaurant' ? 'ร้านอาหาร' : 'เมนูอาหาร'}
                        </div>
                      </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back to Tourism */}
        <div className="mt-8 text-center">
          <Link
            href="/tourism"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            กลับไปหน้าท่องเที่ยว
          </Link>
        </div>
      </div>
    </div>
  );
}
