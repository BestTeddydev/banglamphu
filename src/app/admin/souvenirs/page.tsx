'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Souvenir {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  price?: number;
  category?: string;
  material?: string;
  size?: string;
  weight?: string;
  origin?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSouvenirsPage() {
  const { user, isAdmin } = useAuth();
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSouvenir, setEditingSouvenir] = useState<Souvenir | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: [] as string[],
    price: '',
    category: '',
    material: '',
    size: '',
    weight: '',
    origin: '',
    isActive: true,
    order: 0
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {

    if (isAdmin) {
      fetchSouvenirs();
    }

  }, [isAdmin]);

  const fetchSouvenirs = async () => {
    try {
      const response = await fetch('/api/admin/souvenirs');
      const data = await response.json();
      if (data.success) {
        setSouvenirs(data.data);
      }
    } catch (error) {
      console.error('Error fetching souvenirs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);

      // Create preview URLs
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previewUrls);

      // Clear the images array when new files are selected
      setFormData({ ...formData, images: [] });
    }
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];

    try {
      setUploading(true);
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/admin/souvenirs/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        return data.data.map((item: any) => item.url);
      } else {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการอัปโหลด');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upload images if files are selected
      let imageUrls = formData.images;
      if (selectedFiles.length > 0) {
        imageUrls = await uploadImages();
        if (imageUrls.length === 0) {
          alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
          return;
        }
      }

      // Validate required fields
      if (!formData.name || imageUrls.length === 0) {
        alert('กรุณากรอกชื่อสินค้าและแนบรูปภาพอย่างน้อย 1 รูป');
        return;
      }

      const url = editingSouvenir
        ? `/api/admin/souvenirs/${editingSouvenir._id}`
        : '/api/admin/souvenirs';

      const method = editingSouvenir ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          images: imageUrls,
          price: formData.price ? parseFloat(formData.price) : undefined
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchSouvenirs();
        resetForm();
        alert(editingSouvenir ? 'อัปเดตสินค้าที่ระลึกสำเร็จ' : 'สร้างสินค้าที่ระลึกสำเร็จ');
      } else {
        alert(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error saving souvenir:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้าที่ระลึกนี้?')) return;

    try {
      const response = await fetch(`/api/admin/souvenirs/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        fetchSouvenirs();
        alert('ลบสินค้าที่ระลึกสำเร็จ');
      } else {
        alert(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error deleting souvenir:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const handleEdit = (souvenir: Souvenir) => {
    setEditingSouvenir(souvenir);
    setFormData({
      name: souvenir.name,
      description: souvenir.description || '',
      images: souvenir.images,
      price: souvenir.price ? souvenir.price.toString() : '',
      category: souvenir.category || '',
      material: souvenir.material || '',
      size: souvenir.size || '',
      weight: souvenir.weight || '',
      origin: souvenir.origin || '',
      isActive: souvenir.isActive,
      order: souvenir.order
    });
    setSelectedFiles([]);
    setImagePreviews(souvenir.images);
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      images: [],
      price: '',
      category: '',
      material: '',
      size: '',
      weight: '',
      origin: '',
      isActive: true,
      order: 0
    });
    setSelectedFiles([]);
    setImagePreviews([]);
    setEditingSouvenir(null);
    setShowCreateForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">จัดการสินค้าที่ระลึก</h1>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                เพิ่มสินค้าที่ระลึกใหม่
              </button>
            </div>
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingSouvenir ? 'แก้ไขสินค้าที่ระลึก' : 'เพิ่มสินค้าที่ระลึกใหม่'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      ชื่อสินค้า *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="กรอกชื่อสินค้า"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      ลำดับการแสดง
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    คำอธิบาย
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="กรอกคำอธิบายสินค้า"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      ราคา (บาท)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      หมวดหมู่
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">เลือกหมวดหมู่</option>
                      <option value="ของฝาก">ของฝาก</option>
                      <option value="เสื้อผ้า">เสื้อผ้า</option>
                      <option value="เครื่องประดับ">เครื่องประดับ</option>
                      <option value="ของใช้">ของใช้</option>
                      <option value="อาหาร">อาหาร</option>
                      <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                      <option value="ศิลปะ">ศิลปะ</option>
                      <option value="งานหัตถกรรม">งานหัตถกรรม</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      วัสดุ
                    </label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="กรอกวัสดุ"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      ขนาด
                    </label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="กรอกขนาด"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      น้ำหนัก
                    </label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="กรอกน้ำหนัก"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    แหล่งผลิต
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="กรอกแหล่งผลิต"
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    รูปภาพสินค้า * (สามารถเลือกหลายรูป)
                  </label>
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="block w-full text-base text-gray-900 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      <p className="mt-1 text-sm text-gray-600">
                        รองรับไฟล์ JPG, PNG, WebP ขนาดไม่เกิน 5MB ต่อไฟล์ (สูงสุด 10 ไฟล์)
                      </p>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-4">
                        <p className="text-base font-semibold text-gray-800 mb-2">ตัวอย่างรูปภาพ:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="h-24 w-full object-cover rounded-lg border border-gray-300"
                              />
                              {selectedFiles.length > 0 && (
                                <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                                  ใหม่
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-base text-gray-800">
                    แสดงสินค้าที่ระลึก
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={uploading}
                    className={`px-4 py-2 rounded-lg transition-colors ${uploading
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                  >
                    {uploading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        กำลังอัปโหลด...
                      </div>
                    ) : (
                      editingSouvenir ? 'อัปเดต' : 'สร้าง'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={uploading}
                    className={`px-4 py-2 rounded-lg transition-colors ${uploading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                      }`}
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Souvenirs List */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {souvenirs.map((souvenir) => (
                <div key={souvenir._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                    <img
                      src={souvenir.images[0]}
                      alt={souvenir.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {souvenir.name}
                    </h3>

                    {souvenir.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {souvenir.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      {souvenir.price && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-700">ราคา:</span>
                          <span className="ml-2 text-green-600 font-semibold">
                            ฿{souvenir.price.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {souvenir.category && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-700">หมวดหมู่:</span>
                          <span className="ml-2 text-gray-600">{souvenir.category}</span>
                        </div>
                      )}

                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700">รูปภาพ:</span>
                        <span className="ml-2 text-gray-600">{souvenir.images.length} รูป</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${souvenir.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {souvenir.isActive ? 'แสดง' : 'ซ่อน'}
                      </span>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(souvenir)}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDelete(souvenir._id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {souvenirs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">ยังไม่มีสินค้าที่ระลึก</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
