'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface News {
  _id: string;
  title: string;
  description?: string;
  link: string;
  source?: string;
  category?: string;
  isActive: boolean;
  order: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminNewsPage() {
  const { user, isAdmin } = useAuth();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    source: '',
    category: '',
    isActive: true,
    order: 0,
    publishedAt: ''
  });

  useEffect(() => {

    if (isAdmin) {
      fetchNews();
    }

  }, [isAdmin,]);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/admin/news');
      const data = await response.json();
      if (data.success) {
        setNews(data.data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingNews
        ? `/api/admin/news/${editingNews._id}`
        : '/api/admin/news';

      const method = editingNews ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        fetchNews();
        resetForm();
        alert(editingNews ? 'อัปเดตข่าวสารสำเร็จ' : 'สร้างข่าวสารสำเร็จ');
      } else {
        alert(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบข่าวสารนี้?')) return;

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        fetchNews();
        alert('ลบข่าวสารสำเร็จ');
      } else {
        alert(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      description: newsItem.description || '',
      link: newsItem.link,
      source: newsItem.source || '',
      category: newsItem.category || '',
      isActive: newsItem.isActive,
      order: newsItem.order,
      publishedAt: newsItem.publishedAt ? newsItem.publishedAt.split('T')[0] : ''
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      link: '',
      source: '',
      category: '',
      isActive: true,
      order: 0,
      publishedAt: ''
    });
    setEditingNews(null);
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
              <h1 className="text-2xl font-bold text-gray-900">จัดการข่าวสาร</h1>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                เพิ่มข่าวสารใหม่
              </button>
            </div>
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingNews ? 'แก้ไขข่าวสาร' : 'เพิ่มข่าวสารใหม่'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      หัวข้อข่าว *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="กรอกหัวข้อข่าว"
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
                    placeholder="กรอกคำอธิบายข่าว"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      ลิงก์ข่าว *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/news"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      แหล่งข่าว
                    </label>
                    <input
                      type="text"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="กรอกแหล่งข่าว"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      หมวดหมู่
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">เลือกหมวดหมู่</option>
                      <option value="ทั่วไป">ทั่วไป</option>
                      <option value="การท่องเที่ยว">การท่องเที่ยว</option>
                      <option value="เศรษฐกิจ">เศรษฐกิจ</option>
                      <option value="สังคม">สังคม</option>
                      <option value="เทคโนโลยี">เทคโนโลยี</option>
                      <option value="กีฬา">กีฬา</option>
                      <option value="บันเทิง">บันเทิง</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      วันที่เผยแพร่
                    </label>
                    <input
                      type="date"
                      value={formData.publishedAt}
                      onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
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
                    แสดงข่าวสาร
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingNews ? 'อัปเดต' : 'สร้าง'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* News List */}
          <div className="px-6 py-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      หัวข้อข่าว
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      แหล่งข่าว
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      หมวดหมู่
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ลำดับ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่เผยแพร่
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {news.map((newsItem) => (
                    <tr key={newsItem._id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {newsItem.title}
                          </div>
                          {newsItem.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {newsItem.description}
                            </div>
                          )}
                          <a
                            href={newsItem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            ดูข่าว →
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {newsItem.source || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {newsItem.category || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {newsItem.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${newsItem.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {newsItem.isActive ? 'แสดง' : 'ซ่อน'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(newsItem.publishedAt).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(newsItem)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDelete(newsItem._id)}
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

              {news.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">ยังไม่มีข่าวสาร</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
