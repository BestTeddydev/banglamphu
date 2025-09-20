'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Banner {
  _id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  isActive: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBannersPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    isActive: true,
    order: 0,
    startDate: '',
    endDate: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchBanners();
    }

  }, [isAdmin]);

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/banners', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Clear the image URL field when file is selected
      setFormData({ ...formData, image: '' });
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/admin/banners/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการอัปโหลด');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      // Upload image if file is selected
      let imageUrl = formData.image;
      if (selectedFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
          return;
        }
      }

      // Validate required fields
      if (!formData.title || !imageUrl) {
        alert('กรุณากรอกชื่อแบนเนอร์และอัปโหลดรูปภาพ');
        return;
      }

      const url = editingBanner
        ? `/api/admin/banners/${editingBanner._id}`
        : '/api/admin/banners';

      const method = editingBanner ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchBanners();
        resetForm();
        alert(editingBanner ? 'อัปเดตแบนเนอร์สำเร็จ' : 'สร้างแบนเนอร์สำเร็จ');
      } else {
        alert(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบแบนเนอร์นี้?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchBanners();
        alert('ลบแบนเนอร์สำเร็จ');
      } else {
        alert(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      image: banner.image,
      link: banner.link || '',
      isActive: banner.isActive,
      order: banner.order,
      startDate: banner.startDate ? banner.startDate.split('T')[0] : '',
      endDate: banner.endDate ? banner.endDate.split('T')[0] : ''
    });
    setSelectedFile(null);
    setImagePreview(banner.image);
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      isActive: true,
      order: 0,
      startDate: '',
      endDate: ''
    });
    setSelectedFile(null);
    setImagePreview('');
    setEditingBanner(null);
    setShowCreateForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">จัดการแบนเนอร์</h1>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                เพิ่มแบนเนอร์ใหม่
              </button>
            </div>
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingBanner ? 'แก้ไขแบนเนอร์' : 'เพิ่มแบนเนอร์ใหม่'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      ชื่อแบนเนอร์ *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="กรอกชื่อแบนเนอร์"
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
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="กรอกคำอธิบายแบนเนอร์"
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    รูปภาพแบนเนอร์ *
                  </label>
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="block w-full text-base text-gray-900 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="mt-1 text-sm text-gray-600">
                        รองรับไฟล์ JPG, PNG, WebP ขนาดไม่เกิน 5MB
                      </p>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-base font-semibold text-gray-800 mb-2">ตัวอย่างรูปภาพ:</p>
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-32 w-48 object-cover rounded-lg border border-gray-300"
                          />
                          {selectedFile && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              ใหม่
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Manual URL Input (for editing existing banners) */}
                    {editingBanner && !selectedFile && (
                      <div>
                        <label className="block text-base font-semibold text-gray-800 mb-2">
                          หรือกรอก URL รูปภาพ
                        </label>
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    ลิงก์ (ไม่บังคับ)
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      วันที่เริ่มแสดง
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      วันที่สิ้นสุดการแสดง
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-base text-gray-800">
                    แสดงแบนเนอร์
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={uploading}
                    className={`px-4 py-2 rounded-lg transition-colors ${uploading
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                  >
                    {uploading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        กำลังอัปโหลด...
                      </div>
                    ) : (
                      editingBanner ? 'อัปเดต' : 'สร้าง'
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

          {/* Banners List */}
          <div className="px-6 py-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รูปภาพ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่อแบนเนอร์
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ลำดับ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่สร้าง
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {banners.map((banner) => (
                    <tr key={banner._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="h-16 w-24 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {banner.title}
                          </div>
                          {banner.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {banner.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {banner.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${banner.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {banner.isActive ? 'แสดง' : 'ซ่อน'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(banner.createdAt).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(banner)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDelete(banner._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {banners.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">ยังไม่มีแบนเนอร์</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
