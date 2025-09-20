'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Highlight {
  _id: string;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  duration?: string;
  category?: string;
  tags?: string[];
  viewCount?: number;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminHighlightsPage() {
  const { user, isAdmin } = useAuth();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState<Highlight | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    videoUrl: '',
    duration: '',
    category: '',
    tags: [] as string[],
    isActive: true,
    order: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {

    if (isAdmin) {
      fetchHighlights();
    }

  }, [isAdmin]);

  const fetchHighlights = async () => {
    try {
      const response = await fetch('/api/admin/highlights');
      const data = await response.json();
      if (data.success) {
        setHighlights(data.data);
      }
    } catch (error) {
      console.error('Error fetching highlights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Clear the thumbnail field when new file is selected
      setFormData({ ...formData, thumbnail: '' });
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return '';

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/admin/highlights/upload', {
        method: 'POST',
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
      // Upload image if file is selected
      let thumbnailUrl = formData.thumbnail;
      if (selectedFile) {
        thumbnailUrl = await uploadImage();
        if (!thumbnailUrl) {
          alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
          return;
        }
      }

      // Validate required fields
      if (!formData.title || !thumbnailUrl || !formData.videoUrl) {
        alert('กรุณากรอกชื่อคลิป แนบรูปหน้าปก และลิงก์คลิป');
        return;
      }

      const url = editingHighlight
        ? `/api/admin/highlights/${editingHighlight._id}`
        : '/api/admin/highlights';

      const method = editingHighlight ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          thumbnail: thumbnailUrl
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchHighlights();
        resetForm();
        alert(editingHighlight ? 'อัปเดตไฮไลท์สำเร็จ' : 'สร้างไฮไลท์สำเร็จ');
      } else {
        alert(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error saving highlight:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบไฮไลท์นี้?')) return;

    try {
      const response = await fetch(`/api/admin/highlights/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        fetchHighlights();
        alert('ลบไฮไลท์สำเร็จ');
      } else {
        alert(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error deleting highlight:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const handleEdit = (highlight: Highlight) => {
    setEditingHighlight(highlight);
    setFormData({
      title: highlight.title,
      description: highlight.description || '',
      thumbnail: highlight.thumbnail,
      videoUrl: highlight.videoUrl,
      duration: highlight.duration || '',
      category: highlight.category || '',
      tags: highlight.tags || [],
      isActive: highlight.isActive,
      order: highlight.order
    });
    setSelectedFile(null);
    setImagePreview(highlight.thumbnail);
    setTagInput('');
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      videoUrl: '',
      duration: '',
      category: '',
      tags: [],
      isActive: true,
      order: 0
    });
    setSelectedFile(null);
    setImagePreview('');
    setEditingHighlight(null);
    setShowCreateForm(false);
    setTagInput('');
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
              <h1 className="text-2xl font-bold text-gray-900">จัดการไฮไลท์</h1>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                เพิ่มไฮไลท์ใหม่
              </button>
            </div>
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingHighlight ? 'แก้ไขไฮไลท์' : 'เพิ่มไฮไลท์ใหม่'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      ชื่อคลิป *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="กรอกชื่อคลิป"
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
                    placeholder="กรอกคำอธิบายคลิป"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    ลิงก์คลิป *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="mt-1 text-sm text-gray-600">
                    รองรับ YouTube, Vimeo, Facebook, Instagram, TikTok
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      ระยะเวลา
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="เช่น 5:30"
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
                      <option value="ท่องเที่ยว">ท่องเที่ยว</option>
                      <option value="อาหาร">อาหาร</option>
                      <option value="วัฒนธรรม">วัฒนธรรม</option>
                      <option value="กิจกรรม">กิจกรรม</option>
                      <option value="ชุมชน">ชุมชน</option>
                      <option value="ประวัติศาสตร์">ประวัติศาสตร์</option>
                      <option value="ธรรมชาติ">ธรรมชาติ</option>
                      <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    แท็ก
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="กรอกแท็กแล้วกด Enter"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-3 text-base bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      เพิ่ม
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    รูปหน้าปกคลิป * (อัปโหลดไฟล์ใหม่)
                  </label>
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="block w-full text-base text-gray-900 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      <p className="mt-1 text-sm text-gray-600">
                        รองรับไฟล์ JPG, PNG, WebP ขนาดไม่เกิน 5MB
                      </p>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-base font-semibold text-gray-800 mb-2">ตัวอย่างรูปหน้าปก:</p>
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-32 w-48 object-cover rounded-lg border border-gray-300"
                          />
                          {selectedFile && (
                            <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                              ใหม่
                            </div>
                          )}
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
                    แสดงไฮไลท์
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
                      editingHighlight ? 'อัปเดต' : 'สร้าง'
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

          {/* Highlights List */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((highlight) => (
                <div key={highlight._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img
                      src={highlight.thumbnail}
                      alt={highlight.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {highlight.title}
                    </h3>

                    {highlight.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {highlight.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      {highlight.category && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-700">หมวดหมู่:</span>
                          <span className="ml-2 text-gray-600">{highlight.category}</span>
                        </div>
                      )}

                      {highlight.duration && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-700">ระยะเวลา:</span>
                          <span className="ml-2 text-gray-600">{highlight.duration}</span>
                        </div>
                      )}

                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700">จำนวนผู้ชม:</span>
                        <span className="ml-2 text-gray-600">{highlight.viewCount || 0}</span>
                      </div>
                    </div>

                    {highlight.tags && highlight.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {highlight.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${highlight.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {highlight.isActive ? 'แสดง' : 'ซ่อน'}
                      </span>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(highlight)}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDelete(highlight._id)}
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

            {highlights.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">ยังไม่มีไฮไลท์</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
