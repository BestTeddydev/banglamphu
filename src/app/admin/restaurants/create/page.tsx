'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function CreateRestaurantPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: [''],
    priceRange: '',
    location: {
      address: '',
      coordinates: {
        lat: 0,
        lng: 0
      }
    },
    images: [''],
    openingHours: {
      monday: '08:00-22:00',
      tuesday: '08:00-22:00',
      wednesday: '08:00-22:00',
      thursday: '08:00-22:00',
      friday: '08:00-22:00',
      saturday: '08:00-22:00',
      sunday: '08:00-22:00'
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    facilities: [''],
    averagePrice: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev], '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter((_: string, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up empty strings from arrays
      const cleanedData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        cuisine: formData.cuisine.filter(cuisine => cuisine.trim() !== ''),
        facilities: formData.facilities.filter(facility => facility.trim() !== '')
      };

      const response = await fetch('/api/admin/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        router.push('/admin/restaurants');
      } else {
        alert('เกิดข้อผิดพลาดในการสร้างร้านอาหาร');
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
      alert('เกิดข้อผิดพลาดในการสร้างร้านอาหาร');
    } finally {
      setLoading(false);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">เพิ่มร้านอาหารใหม่</h1>
          <p className="text-gray-600 mt-1">กรอกข้อมูลร้านอาหารในชุมชนบางลำพู</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ข้อมูลพื้นฐาน</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อร้านอาหาร *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  คำอธิบาย *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ระดับราคา *
                </label>
                <select
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">เลือกระดับราคา</option>
                  <option value="budget">ประหยัด (ต่ำกว่า 100 บาท)</option>
                  <option value="moderate">ปานกลาง (100-300 บาท)</option>
                  <option value="expensive">แพง (มากกว่า 300 บาท)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ราคาเฉลี่ย (บาท)
                </label>
                <input
                  type="number"
                  name="averagePrice"
                  value={formData.averagePrice}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ที่อยู่ *
                </label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ละติจูด
                </label>
                <input
                  type="number"
                  step="any"
                  name="location.coordinates.lat"
                  value={formData.location.coordinates.lat}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ลองจิจูด
                </label>
                <input
                  type="number"
                  step="any"
                  name="location.coordinates.lng"
                  value={formData.location.coordinates.lng}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Cuisine Types */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ประเภทอาหาร</h2>
            
            {formData.cuisine.map((cuisine, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={cuisine}
                  onChange={(e) => handleArrayChange('cuisine', index, e.target.value)}
                  placeholder="ประเภทอาหาร (เช่น อาหารไทย, อาหารจีน)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.cuisine.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('cuisine', index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    ลบ
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('cuisine')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              เพิ่มประเภทอาหาร
            </button>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">รูปภาพ</h2>
            
            {formData.images.map((image, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => handleArrayChange('images', index, e.target.value)}
                  placeholder="URL รูปภาพ"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('images', index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    ลบ
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('images')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              เพิ่มรูปภาพ
            </button>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ข้อมูลติดต่อ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  อีเมล
                </label>
                <input
                  type="email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เว็บไซต์
                </label>
                <input
                  type="url"
                  name="contact.website"
                  value={formData.contact.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">สิ่งอำนวยความสะดวก</h2>
            
            {formData.facilities.map((facility, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={facility}
                  onChange={(e) => handleArrayChange('facilities', index, e.target.value)}
                  placeholder="สิ่งอำนวยความสะดวก (เช่น ที่จอดรถ, WiFi, เครื่องปรับอากาศ)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.facilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('facilities', index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    ลบ
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('facilities')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              เพิ่มสิ่งอำนวยความสะดวก
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/restaurants"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
