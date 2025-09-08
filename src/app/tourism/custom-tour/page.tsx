'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CustomTourPage() {
  const [selectedAttractions, setSelectedAttractions] = useState<string[]>([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);

  const attractionsData = [
    { id: '1', name: 'วัดบางลำพู', coordinates: { lat: 13.7563, lng: 100.5018 } },
    { id: '2', name: 'ตลาดบางลำพู', coordinates: { lat: 13.7573, lng: 100.5028 } },
    { id: '3', name: 'พิพิธภัณฑ์ชุมชนบางลำพู', coordinates: { lat: 13.7583, lng: 100.5038 } },
    { id: '4', name: 'สวนสาธารณะบางลำพู', coordinates: { lat: 13.7593, lng: 100.5048 } }
  ];

  const restaurantsData = [
    { id: '1', name: 'ร้านอาหารบ้านบางลำพู', coordinates: { lat: 13.7563, lng: 100.5018 } },
    { id: '2', name: 'ร้านขนมโบราณบางลำพู', coordinates: { lat: 13.7573, lng: 100.5028 } },
    { id: '3', name: 'ร้านชาบางลำพู', coordinates: { lat: 13.7583, lng: 100.5038 } },
    { id: '4', name: 'ร้านอาหารริมน้ำบางลำพู', coordinates: { lat: 13.7593, lng: 100.5048 } }
  ];

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

  const selectedPlaces = [
    ...attractionsData.filter(attraction => selectedAttractions.includes(attraction.id)),
    ...restaurantsData.filter(restaurant => selectedRestaurants.includes(restaurant.id))
  ];

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
          <p className="text-gray-600">เลือกแหล่งท่องเที่ยวและร้านอาหารที่คุณสนใจ เพื่อสร้างทัวร์ของคุณเอง</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selection Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Attractions Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">เลือกแหล่งท่องเที่ยว</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attractionsData.map((attraction) => (
                  <label key={attraction.id} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedAttractions.includes(attraction.id)}
                      onChange={() => handleAttractionToggle(attraction.id)}
                      className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{attraction.name}</div>
                      <div className="text-sm text-gray-600">แหล่งท่องเที่ยว</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Restaurants Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">เลือกร้านอาหาร</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurantsData.map((restaurant) => (
                  <label key={restaurant.id} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedRestaurants.includes(restaurant.id)}
                      onChange={() => handleRestaurantToggle(restaurant.id)}
                      className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{restaurant.name}</div>
                      <div className="text-sm text-gray-600">ร้านอาหาร</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowMap(true)}
                disabled={selectedPlaces.length === 0}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                ดูแผนที่
              </button>
              <button
                onClick={() => {
                  setSelectedAttractions([]);
                  setSelectedRestaurants([]);
                  setShowMap(false);
                }}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
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
                  <p className="text-sm text-gray-400">เลือกแหล่งท่องเที่ยวและร้านอาหารเพื่อสร้างทัวร์ของคุณ</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">สถานที่ที่เลือก ({selectedPlaces.length})</h4>
                    <div className="space-y-2">
                      {selectedPlaces.map((place, index) => (
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
                      <div>ระยะเวลาโดยประมาณ: {selectedPlaces.length * 1.5} ชั่วโมง</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">คำแนะนำ</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• เริ่มต้นจากสถานที่ที่อยู่ใกล้กัน</li>
                      <li>• วางแผนเวลาให้เหมาะสม</li>
                      <li>• เตรียมเงินสดสำหรับค่าใช้จ่าย</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        {showMap && selectedPlaces.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">แผนที่ตำแหน่งสถานที่</h3>
              <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-gray-600 mb-2">แผนที่แสดงตำแหน่งสถานที่</p>
                  <p className="text-sm text-gray-500">สถานที่ที่เลือกจะแสดงบนแผนที่นี้</p>
                  
                  <div className="mt-4 space-y-2">
                    {selectedPlaces.map((place, index) => (
                      <div key={index} className="flex items-center justify-center text-sm text-gray-600">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        {place.name} - {place.coordinates.lat}, {place.coordinates.lng}
                      </div>
                    ))}
                  </div>
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
