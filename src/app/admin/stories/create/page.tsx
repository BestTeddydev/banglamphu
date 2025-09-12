'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface StoryPage {
  pageNumber: number;
  image: string;
  text: string;
  title?: string;
}

export default function CreateStoryPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    pages: [] as StoryPage[],
    isPublished: false
  });
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'page', pageIndex?: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    
    try {
      const file = files[0];
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
      
      if (type === 'cover') {
        setFormData(prev => ({
          ...prev,
          coverImage: result.url
        }));
      } else if (type === 'page' && pageIndex !== undefined) {
        setFormData(prev => ({
          ...prev,
          pages: prev.pages.map((page, index) => 
            index === pageIndex ? { ...page, image: result.url } : page
          )
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const addPage = () => {
    const newPageNumber = formData.pages.length + 1;
    setFormData(prev => ({
      ...prev,
      pages: [...prev.pages, {
        pageNumber: newPageNumber,
        image: '',
        text: '',
        title: ''
      }]
    }));
  };

  const removePage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pages: prev.pages.filter((_, i) => i !== index).map((page, i) => ({
        ...page,
        pageNumber: i + 1
      }))
    }));
  };

  const updatePage = (index: number, field: keyof StoryPage, value: string) => {
    setFormData(prev => ({
      ...prev,
      pages: prev.pages.map((page, i) => 
        i === index ? { ...page, [field]: value } : page
      )
    }));
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.pages.length) return;

    setFormData(prev => {
      const newPages = [...prev.pages];
      [newPages[index], newPages[newIndex]] = [newPages[newIndex], newPages[index]];
      
      // Update page numbers
      newPages.forEach((page, i) => {
        page.pageNumber = i + 1;
      });
      
      return {
        ...prev,
        pages: newPages
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/stories');
      } else {
        alert('เกิดข้อผิดพลาดในการสร้างนิทาน');
      }
    } catch (error) {
      console.error('Error creating story:', error);
      alert('เกิดข้อผิดพลาดในการสร้างนิทาน');
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
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/admin" className="hover:text-green-600">แอดมิน</Link>
            <span>›</span>
            <Link href="/admin/stories" className="hover:text-green-600">นิทาน</Link>
            <span>›</span>
            <span className="text-gray-900">สร้างใหม่</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">สร้างนิทานใหม่</h1>
          <p className="text-gray-600">สร้างนิทานสำหรับเด็กด้วยรูปภาพและข้อความ</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">ข้อมูลพื้นฐาน</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    ชื่อนิทาน *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                    placeholder="ชื่อนิทาน"
                  />
                </div>

                <div>
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
                    placeholder="คำอธิบายสั้นๆ เกี่ยวกับนิทาน"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    รูปภาพปก *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'cover')}
                    disabled={uploadingImages}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
                  />
                  {formData.coverImage && (
                    <div className="mt-4">
                      <img
                        src={formData.coverImage}
                        alt="Cover preview"
                        className="w-32 h-48 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pages */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">หน้าของนิทาน</h2>
                <button
                  type="button"
                  onClick={addPage}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
                >
                  เพิ่มหน้า
                </button>
              </div>

              {formData.pages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>ยังไม่มีหน้าในนิทาน</p>
                  <p className="text-sm">คลิก "เพิ่มหน้า" เพื่อเริ่มสร้าง</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.pages.map((page, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          หน้าที่ {page.pageNumber}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => movePage(index, 'up')}
                            disabled={index === 0}
                            className="px-3 py-1 bg-gray-600 text-white rounded text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => movePage(index, 'down')}
                            disabled={index === formData.pages.length - 1}
                            className="px-3 py-1 bg-gray-600 text-white rounded text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removePage(index)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            ลบ
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            รูปภาพ
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'page', index)}
                            disabled={uploadingImages}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                          {page.image && (
                            <div className="mt-2">
                              <img
                                src={page.image}
                                alt={`Page ${page.pageNumber} preview`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                              ชื่อหน้า (ไม่บังคับ)
                            </label>
                            <input
                              type="text"
                              value={page.title || ''}
                              onChange={(e) => updatePage(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium placeholder-gray-500"
                              placeholder="ชื่อหน้า"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                              ข้อความ *
                            </label>
                            <textarea
                              value={page.text}
                              onChange={(e) => updatePage(index, 'text', e.target.value)}
                              required
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium placeholder-gray-500 resize-vertical"
                              placeholder="ข้อความในหน้านี้"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Publish Option */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 text-sm font-semibold text-gray-800">
                  เผยแพร่นิทานทันที
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                หากไม่เลือก นิทานจะถูกเก็บเป็นร่าง
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/stories"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={loading || formData.pages.length === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'กำลังสร้าง...' : 'สร้างนิทาน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
