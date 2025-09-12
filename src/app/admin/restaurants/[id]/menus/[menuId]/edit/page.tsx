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

export default function EditMenuPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;
  const menuId = params.menuId as string;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    images: [] as string[],
    ingredients: [''],
    allergens: [] as string[],
    isVegetarian: false,
    isSpicy: false,
    isAvailable: true,
    preparationTime: 15,
    calories: 0,
    order: 0
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [pendingImages, setPendingImages] = useState<File[]>([]);

  // Fetch restaurant and menu data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurant data
        const restaurantResponse = await fetch(`/api/admin/restaurants/${restaurantId}`, {
          credentials: 'include',
        });

        if (restaurantResponse.ok) {
          const restaurantData = await restaurantResponse.json();
          setRestaurant(restaurantData);
        } else {
          alert('ไม่พบข้อมูลร้านอาหาร');
          router.push('/admin/restaurants');
          return;
        }

        // Fetch menu data
        const menuResponse = await fetch(`/api/admin/menus/${menuId}`, {
          credentials: 'include',
        });

        if (menuResponse.ok) {
          const menuData = await menuResponse.json();
          const menu = menuData.menu;
          setFormData({
            name: menu.name || '',
            description: menu.description || '',
            price: menu.price || 0,
            category: menu.category || '',
            images: menu.images || [],
            ingredients: menu.ingredients && menu.ingredients.length > 0 ? menu.ingredients : [''],
            allergens: menu.allergens || [],
            isVegetarian: menu.isVegetarian || false,
            isSpicy: menu.isSpicy || false,
            isAvailable: menu.isAvailable !== undefined ? menu.isAvailable : true,
            preparationTime: menu.preparationTime || 15,
            calories: menu.calories || 0,
            order: menu.order || 0
          });
        } else {
          alert('ไม่พบข้อมูลเมนู');
          router.push(`/admin/restaurants/${restaurantId}/menus`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        router.push(`/admin/restaurants/${restaurantId}/menus`);
      } finally {
        setFetching(false);
      }
    };

    if (restaurantId && menuId) {
      fetchData();
    }
  }, [restaurantId, menuId, router]);

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

  const handleArrayChange = (field: 'ingredients' | 'allergens', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: 'ingredients' | 'allergens') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'ingredients' | 'allergens', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index)
    }));
  };

  const handleAllergenChange = (allergen: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      allergens: checked 
        ? [...prev.allergens, allergen]
        : prev.allergens.filter(a => a !== allergen)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

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

      // 3. ส่งข้อมูลไปอัพเดทเมนู
      const cleanedData = {
        ...formData,
        images: allImages.filter(img => img.trim() !== ''),
        ingredients: formData.ingredients.filter(ingredient => ingredient.trim() !== ''),
        allergens: formData.allergens.filter(allergen => allergen.trim() !== ''),
        calories: formData.calories || undefined
      };

      const response = await fetch(`/api/admin/menus/${menuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        setPendingImages([]);
        router.push(`/admin/restaurants/${restaurantId}/menus`);
      } else {
        alert('เกิดข้อผิดพลาดในการอัพเดทเมนู');
      }
    } catch (error) {
      console.error('Error updating menu:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดทเมนู');
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
          <p className="text-gray-600">กำลังโหลดข้อมูลเมนู...</p>
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
            <Link href={`/admin/restaurants/${restaurantId}/menus`} className="hover:text-green-600">{restaurant?.name}</Link>
            <span>›</span>
            <span className="text-gray-900">แก้ไขเมนู</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">แก้ไขเมนู</h1>
          <p className="text-gray-600">แก้ไขข้อมูลเมนูอาหาร</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">ข้อมูลพื้นฐาน</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  ชื่อเมนู *
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
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 resize-vertical shadow-sm hover:shadow-md focus:shadow-md"
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
                  <option value="appetizer">อาหารเรียกน้ำย่อย</option>
                  <option value="main_course">อาหารจานหลัก</option>
                  <option value="dessert">ของหวาน</option>
                  <option value="beverage">เครื่องดื่ม</option>
                  <option value="soup">ซุป</option>
                  <option value="salad">สลัด</option>
                  <option value="side_dish">เครื่องเคียง</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  เวลาปรุง (นาที) *
                </label>
                <input
                  type="number"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="300"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  แคลอรี่ (ไม่บังคับ)
                </label>
                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">มังสวิรัติ</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isSpicy"
                      checked={formData.isSpicy}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">เผ็ด</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">พร้อมขาย</span>
                  </label>
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

          {/* Ingredients */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">ส่วนผสม</h2>
            
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                  placeholder="ส่วนผสม"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('ingredients', index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200"
                  >
                    ลบ
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('ingredients')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
            >
              เพิ่มส่วนผสม
            </button>
            </div>
          </div>

          {/* Allergens */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">สารก่อภูมิแพ้</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['nuts', 'dairy', 'eggs', 'soy', 'gluten', 'shellfish', 'fish', 'sesame'].map((allergen) => (
                <label key={allergen} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.allergens.includes(allergen)}
                    onChange={(e) => handleAllergenChange(allergen, e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {allergen === 'nuts' && 'ถั่ว'}
                    {allergen === 'dairy' && 'นม'}
                    {allergen === 'eggs' && 'ไข่'}
                    {allergen === 'soy' && 'ถั่วเหลือง'}
                    {allergen === 'gluten' && 'กลูเตน'}
                    {allergen === 'shellfish' && 'หอย'}
                    {allergen === 'fish' && 'ปลา'}
                    {allergen === 'sesame' && 'งา'}
                  </span>
                </label>
              ))}
            </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href={`/admin/restaurants/${restaurantId}/menus`}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'กำลังอัพเดท...' : 'อัพเดทเมนู'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
