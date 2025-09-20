'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface StoryPage {
  pageNumber: number;
  image: string;
  text: string;
  title?: string;
}

interface Story {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  pages: StoryPage[];
  isPublished: boolean;
  createdAt: string;
}

export default function EditStoryPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const params = useParams();
  const storyId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    pages: [] as StoryPage[],
    isPublished: false
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string>('');
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    if (storyId) {
      fetchStory();
    }
  }, [storyId]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/stories/${storyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch story');
      }
      const data = await response.json();
      setFormData({
        title: data.title || '',
        description: data.description || '',
        coverImage: data.coverImage || '',
        pages: data.pages || [],
        isPublished: data.isPublished || false
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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
    const pageToRemove = formData.pages[index];

    // Add image to delete list if it exists
    if (pageToRemove.image) {
      setImagesToDelete(prev => [...prev, pageToRemove.image]);
    }

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
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/stories/${storyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Delete old images if any
        if (imagesToDelete.length > 0) {
          try {
            await fetch('/api/upload/delete', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ urls: imagesToDelete }),
            });
          } catch (deleteError) {
            console.error('Error deleting old images:', deleteError);
          }
        }

        // Reset states
        setPendingImages([]);
        setImagesToDelete([]);

        router.push('/admin/stories');
      } else {
        alert('เกิดข้อผิดพลาดในการอัพเดทเรื่องประวัติศาสตร์');
      }
    } catch (error) {
      console.error('Error updating story:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดทเรื่องประวัติศาสตร์');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/admin/stories" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            กลับไปยังรายการประวัติศาสตร์
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
            <Link href="/admin/stories" className="hover:text-green-600">ประวัติศาสตร์</Link>
            <span>›</span>
            <span className="text-gray-900">แก้ไข</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">แก้ไขเรื่องประวัติศาสตร์</h1>
          <p className="text-gray-600">แก้ไขข้อมูลเรื่องประวัติศาสตร์และหน้าต่างๆ</p>
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
                    ชื่อเรื่องประวัติศาสตร์ *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-md"
                    placeholder="ชื่อเรื่องประวัติศาสตร์"
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
                    placeholder="คำอธิบายสั้นๆ เกี่ยวกับเรื่องประวัติศาสตร์"
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
                <h2 className="text-xl font-bold text-gray-900">หน้าของเรื่องประวัติศาสตร์</h2>
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
                  <p>ยังไม่มีหน้าในเรื่องประวัติศาสตร์</p>
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
                  เผยแพร่เรื่องประวัติศาสตร์
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                หากไม่เลือก เรื่องประวัติศาสตร์จะถูกเก็บเป็นร่าง
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
              disabled={saving || formData.pages.length === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed font-medium"
            >
              {saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
