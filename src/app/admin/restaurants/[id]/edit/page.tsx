'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
}

export default function EditRestaurantPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: {
      address: '',
      coordinates: {
        lat: 0,
        lng: 0
      }
    },
    images: [] as string[],
    openingHours: {
      open: '08:00',
      close: '22:00'
    },
    contactInfo: '',
    priceRange: '$',
    features: [''],
    tags: ['']
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [pendingImages, setPendingImages] = useState<File[]>([]);

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`/api/admin/restaurants/${restaurantId}`, {
          credentials: 'include',
        });

        if (response.ok) {
          const restaurant: Restaurant = await response.json();
          setFormData({
            name: restaurant.name || '',
            description: restaurant.description || '',
            category: restaurant.category || '',
            location: {
              address: restaurant.location?.address || '',
              coordinates: {
                lat: restaurant.location?.coordinates?.lat || 0,
                lng: restaurant.location?.coordinates?.lng || 0
              }
            },
            images: restaurant.images || [],
            openingHours: {
              open: restaurant.openingHours?.open || '08:00',
              close: restaurant.openingHours?.close || '22:00'
            },
            contactInfo: restaurant.contactInfo || '',
            priceRange: restaurant.priceRange || '$',
            features: restaurant.features && restaurant.features.length > 0 ? restaurant.features : [''],
            tags: restaurant.tags && restaurant.tags.length > 0 ? restaurant.tags : ['']
          });
        } else {
          alert('ไม่พบข้อมูลร้านอาหาร');
          router.push('/admin/restaurants');
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูลร้านอาหาร');
        router.push('/admin/restaurants');
      } finally {
        setFetching(false);
      }
    };

    if (restaurantId) {
      fetchRestaurant();
    }
  }, [restaurantId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'location') {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            [child]: child === 'coordinates' ? {
              ...prev.location.coordinates,
              [name.split('.')[2]]: value
            } : value
          }
        }));
      } else if (parent === 'openingHours') {
        setFormData(prev => ({
          ...prev,
          openingHours: {
            ...prev.openingHours,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (field: 'features' | 'tags', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: 'features' | 'tags') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'features' | 'tags', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // เพิ่มไฟล์ใหม่เข้าไปในรายการรออัพโหลด
    setPendingImages(prev => [...prev, ...Array.from(files)]);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removePendingImage = (index: number) => {
    setPendingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadingImages(true);

    try {
      // 1. อัพโหลดรูปภาพใหม่ก่อน
      let uploadedImageUrls: string[] = [];
      if (pendingImages.length > 0) {
        const uploadPromises = pendingImages.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to upload image');
          }

          const result = await response.json();
          return result.url;
        });

        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      // 2. รวมรูปภาพเก่าและใหม่
      const allImages = [...formData.images, ...uploadedImageUrls];

      // 3. ส่งข้อมูลไปอัพเดทร้านอาหาร
      const cleanedData = {
        ...formData,
        images: allImages.filter(img => img.trim() !== ''),
        features: formData.features.filter(feature => feature.trim() !== ''),
        tags: formData.tags.filter(tag => tag.trim() !== '')
      };

      const response = await fetch(`/api/admin/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        // 4. รีเซ็ตสถานะ
        setPendingImages([]);
        router.push('/admin/restaurants');
      } else {
        alert('เกิดข้อผิดพลาดในการอัพเดทร้านอาหาร');
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดทร้านอาหาร');
    } finally {
      setLoading(false);
      setUploadingImages(false);
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

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลร้านอาหาร...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/admin" className="hover:text-green-600">แอดมิน</Link>
            <span>›</span>
            <Link href="/admin/restaurants" className="hover:text-green-600">ร้านอาหาร</Link>
            <span>›</span>
            <span className="text-gray-900">แก้ไข</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">แก้ไขร้านอาหาร</h1>
          <p className="text-gray-600">แก้ไขข้อมูลร้านอาหารในชุมชนบางลำพู</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">ข้อมูลพื้นฐาน</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  ชื่อร้านอาหาร *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  คำอธิบาย *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 resize-vertical shadow-sm hover:shadow-md focus:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  หมวดหมู่ *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium bg-white shadow-sm hover:shadow-md focus:shadow-md"
                >
                  <option value="">เลือกหมวดหมู่</option>
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

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  ระดับราคา *
                </label>
                <select
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium bg-white shadow-sm hover:shadow-md focus:shadow-md"
                >
                  <option value="$">$ (ถูก)</option>
                  <option value="$$">$$ (ปานกลาง)</option>
                  <option value="$$$">$$$ (แพง)</option>
                  <option value="$$$$">$$$$ (แพงมาก)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  ที่อยู่ *
                </label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  ข้อมูลติดต่อ
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  placeholder="เบอร์โทรศัพท์ หรือ อีเมล"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  ละติจูด
                </label>
                <input
                  type="number"
                  step="any"
                  name="location.coordinates.lat"
                  value={formData.location.coordinates.lat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  ลองจิจูด
                </label>
                <input
                  type="number"
                  step="any"
                  name="location.coordinates.lng"
                  value={formData.location.coordinates.lng}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  เวลาเปิด
                </label>
                <input
                  type="time"
                  name="openingHours.open"
                  value={formData.openingHours.open}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium shadow-sm hover:shadow-md focus:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  เวลาปิด
                </label>
                <input
                  type="time"
                  name="openingHours.close"
                  value={formData.openingHours.close}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium shadow-sm hover:shadow-md focus:shadow-md"
                />
              </div>
            </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">รูปภาพ</h2>
            
            {/* Upload Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                อัพโหลดรูปภาพเพิ่มเติม
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImages}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
              />
              <p className="text-sm text-gray-500 mt-1">
                รองรับไฟล์ JPEG, PNG, WebP ขนาดไม่เกิน 5MB
              </p>
              {uploadingImages && (
                <p className="text-sm text-blue-600 mt-1">กำลังอัพโหลดและบันทึกข้อมูล...</p>
              )}
            </div>

            {/* Pending Images Preview */}
            {pendingImages.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">รูปภาพที่รออัพโหลด</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {pendingImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`รูปภาพใหม่ ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePendingImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        รออัพโหลด
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">รูปภาพปัจจุบัน</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`รูปภาพ ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">คุณสมบัติเด่น</h2>
            
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayChange('features', index, e.target.value)}
                  placeholder="คุณสมบัติเด่น"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('features', index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200"
                  >
                    ลบ
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('features')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
            >
              เพิ่มคุณสมบัติเด่น
            </button>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">แท็ก</h2>
            
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                  placeholder="แท็ก"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                />
                {formData.tags.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('tags', index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200"
                  >
                    ลบ
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('tags')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
            >
              เพิ่มแท็ก
            </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/restaurants"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'กำลังอัพเดท...' : 'อัพเดทร้านอาหาร'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
