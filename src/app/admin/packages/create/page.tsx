'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function CreatePackagePage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 2,
    price: 0,
    maxParticipants: 16,
    includes: [''],
    itinerary: [{ time: '', activity: '', location: '' }],
    attractions: [] as string[],
    restaurants: [] as string[],
    images: [] as string[],
    category: 'อาหาร',
    difficulty: 'easy' as 'easy' | 'moderate' | 'hard',
    isActive: true,
    tourDates: [{ date: '', startTime: '', endTime: '', availableSlots: 16 }]
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (field: 'includes', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const handleItineraryChange = (index: number, field: 'time' | 'activity' | 'location', value: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleTourDateChange = (index: number, field: 'date' | 'startTime' | 'endTime' | 'availableSlots', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      tourDates: prev.tourDates.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (field: 'includes') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const addItineraryItem = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { time: '', activity: '', location: '' }]
    }));
  };

  const addTourDateItem = () => {
    setFormData(prev => ({
      ...prev,
      tourDates: [...prev.tourDates, { date: '', startTime: '', endTime: '', availableSlots: formData.maxParticipants }]
    }));
  };

  const removeArrayItem = (field: 'includes', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index)
    }));
  };

  const removeItineraryItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));
  };

  const removeTourDateItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tourDates: prev.tourDates.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }

    const newFiles = Array.from(files);
    setPendingImages(prev => [...prev, ...newFiles]);
    
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
      // 1. อัพโหลดรูปภาพก่อน
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

      // 3. ส่งข้อมูลไปสร้างแพ็คเกจ
      const cleanedData = {
        ...formData,
        images: allImages.filter(img => img.trim() !== ''),
        includes: formData.includes.filter(item => item.trim() !== ''),
        itinerary: formData.itinerary.filter(item => 
          item.time.trim() !== '' && item.activity.trim() !== '' && item.location.trim() !== ''
        ),
        tourDates: formData.tourDates.filter(item => 
          item.date.trim() !== '' && item.startTime.trim() !== '' && item.endTime.trim() !== ''
        ).map(item => ({
          ...item,
          date: new Date(item.date),
          availableSlots: parseInt(item.availableSlots.toString()) || formData.maxParticipants
        }))
      };

      const response = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        setPendingImages([]);
        router.push('/admin/packages');
      } else {
        alert('เกิดข้อผิดพลาดในการสร้างแพ็คเกจ');
      }
    } catch (error) {
      console.error('Error creating package:', error);
      alert('เกิดข้อผิดพลาดในการสร้างแพ็คเกจ');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/admin" className="hover:text-green-600">แอดมิน</Link>
            <span>›</span>
            <Link href="/admin/packages" className="hover:text-green-600">แพ็คเกจทัวร์</Link>
            <span>›</span>
            <span className="text-gray-900">สร้างใหม่</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">เพิ่มแพ็คเกจทัวร์ใหม่</h1>
          <p className="text-gray-600">เพิ่มแพ็คเกจทัวร์ในชุมชนบางลำพู</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">ข้อมูลพื้นฐาน</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  ชื่อแพ็คเกจ *
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
                  ระยะเวลา (ชั่วโมง) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  ราคา (บาท) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  จำนวนผู้เข้าร่วมสูงสุด *
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
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
                  <option value="วัฒนธรรม">วัฒนธรรม</option>
                  <option value="ธรรมชาติ">ธรรมชาติ</option>
                  <option value="อาหาร">อาหาร</option>
                  <option value="ประวัติศาสตร์">ประวัติศาสตร์</option>
                  <option value="ผจญภัย">ผจญภัย</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  ระดับความยาก *
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium bg-white shadow-sm hover:shadow-md focus:shadow-md"
                >
                  <option value="easy">ง่าย</option>
                  <option value="moderate">ปานกลาง</option>
                  <option value="hard">ยาก</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">เปิดใช้งาน</span>
                </div>
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
                อัพโหลดรูปภาพ
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
              {uploadError && (
                <p className="text-sm text-red-600 mt-1">{uploadError}</p>
              )}
              {uploadingImages && (
                <p className="text-sm text-blue-600 mt-1">กำลังอัพโหลดและบันทึกข้อมูล...</p>
              )}
            </div>

            {/* Pending Images Preview */}
            {pendingImages.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">รูปภาพที่รออัพโหลด ({pendingImages.length})</h3>
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
                      <div className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                        {(file.size / 1024 / 1024).toFixed(1)}MB
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">รูปภาพที่อัพโหลดแล้ว</h3>
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

            {/* Show message when no images are selected */}
            {formData.images.length === 0 && pendingImages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">ยังไม่ได้เลือกรูปภาพ</p>
                <p className="text-sm">กรุณาเลือกรูปภาพที่ต้องการอัพโหลด</p>
                <p className="text-xs text-gray-400 mt-2">สามารถเลือกหลายรูปพร้อมกันได้</p>
              </div>
            )}
            </div>
          </div>

          {/* Includes */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">สิ่งที่รวมในแพ็คเกจ</h2>
            
            {formData.includes.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('includes', index, e.target.value)}
                  placeholder="สิ่งที่รวมในแพ็คเกจ"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                />
                {formData.includes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('includes', index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200"
                  >
                    ลบ
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('includes')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
            >
              เพิ่มรายการ
            </button>
            </div>
          </div>

          {/* Tour Dates */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">วันที่จัดทัวร์</h2>
            
            {formData.tourDates.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">วันที่</label>
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) => handleTourDateChange(index, 'date', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">เวลาเริ่ม</label>
                  <input
                    type="time"
                    value={item.startTime}
                    onChange={(e) => handleTourDateChange(index, 'startTime', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">เวลาจบ</label>
                  <input
                    type="time"
                    value={item.endTime}
                    onChange={(e) => handleTourDateChange(index, 'endTime', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">จำนวนที่ว่าง</label>
                  <input
                    type="number"
                    value={item.availableSlots}
                    onChange={(e) => handleTourDateChange(index, 'availableSlots', parseInt(e.target.value) || 0)}
                    required
                    min="1"
                    max={formData.maxParticipants}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
                  />
                </div>
                {formData.tourDates.length > 1 && (
                  <div className="md:col-span-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeTourDateItem(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200"
                    >
                      ลบวันที่
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addTourDateItem}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
            >
              เพิ่มวันที่ทัวร์
            </button>
            </div>
          </div>

          {/* Itinerary */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">กำหนดการทัวร์</h2>
            
            {formData.itinerary.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">เวลา</label>
                  <input
                    type="text"
                    value={item.time}
                    onChange={(e) => handleItineraryChange(index, 'time', e.target.value)}
                    placeholder="เช่น 12:00-14:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">กิจกรรม</label>
                  <input
                    type="text"
                    value={item.activity}
                    onChange={(e) => handleItineraryChange(index, 'activity', e.target.value)}
                    placeholder="เช่น รับประทานอาหาร"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">สถานที่</label>
                  <input
                    type="text"
                    value={item.location}
                    onChange={(e) => handleItineraryChange(index, 'location', e.target.value)}
                    placeholder="เช่น ศูนย์เรียนรู้เสน่ห์บางลำพู"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium placeholder-gray-500"
                  />
                </div>
                {formData.itinerary.length > 1 && (
                  <div className="md:col-span-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeItineraryItem(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200"
                    >
                      ลบรายการ
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addItineraryItem}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
            >
              เพิ่มรายการกำหนดการ
            </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/packages"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'กำลังสร้าง...' : 'สร้างแพ็คเกจ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
