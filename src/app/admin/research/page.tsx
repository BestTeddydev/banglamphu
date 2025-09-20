'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Research {
  _id: string;
  title: string;
  description?: string;
  authors?: string[];
  abstract?: string;
  keywords?: string[];
  pdfFile: string;
  category?: string;
  year?: number;
  isActive: boolean;
  order: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminResearchPage() {
  const { user, isAdmin } = useAuth();
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingResearch, setEditingResearch] = useState<Research | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    authors: '',
    abstract: '',
    keywords: '',
    pdfFile: '',
    category: '',
    year: '',
    isActive: true,
    order: 0,
    publishedAt: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {

    if (isAdmin) {
      fetchResearch();
    }

  }, [isAdmin]);

  const fetchResearch = async () => {
    try {
      const response = await fetch('/api/admin/research');
      const data = await response.json();
      if (data.success) {
        setResearch(data.data);
      }
    } catch (error) {
      console.error('Error fetching research:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Clear the PDF file URL field when file is selected
      setFormData({ ...formData, pdfFile: '' });
    }
  };

  const uploadPDF = async () => {
    if (!selectedFile) return null;

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/admin/research/upload', {
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
      console.error('Error uploading PDF:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upload PDF if file is selected
      let pdfUrl = formData.pdfFile;
      if (selectedFile) {
        pdfUrl = await uploadPDF();
        if (!pdfUrl) {
          alert('เกิดข้อผิดพลาดในการอัปโหลดไฟล์ PDF');
          return;
        }
      }

      // Validate required fields
      if (!formData.title || !pdfUrl) {
        alert('กรุณากรอกชื่อหัวข้อและแนบไฟล์ PDF');
        return;
      }

      const url = editingResearch
        ? `/api/admin/research/${editingResearch._id}`
        : '/api/admin/research';

      const method = editingResearch ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          pdfFile: pdfUrl,
          authors: formData.authors ? formData.authors.split(',').map(a => a.trim()) : [],
          keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()) : [],
          year: formData.year ? parseInt(formData.year) : undefined
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchResearch();
        resetForm();
        alert(editingResearch ? 'อัปเดตผลงานวิจัยสำเร็จ' : 'สร้างผลงานวิจัยสำเร็จ');
      } else {
        alert(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error saving research:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบผลงานวิจัยนี้?')) return;

    try {
      const response = await fetch(`/api/admin/research/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        fetchResearch();
        alert('ลบผลงานวิจัยสำเร็จ');
      } else {
        alert(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error deleting research:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const handleEdit = (researchItem: Research) => {
    setEditingResearch(researchItem);
    setFormData({
      title: researchItem.title,
      description: researchItem.description || '',
      authors: researchItem.authors ? researchItem.authors.join(', ') : '',
      abstract: researchItem.abstract || '',
      keywords: researchItem.keywords ? researchItem.keywords.join(', ') : '',
      pdfFile: researchItem.pdfFile,
      category: researchItem.category || '',
      year: researchItem.year ? researchItem.year.toString() : '',
      isActive: researchItem.isActive,
      order: researchItem.order,
      publishedAt: researchItem.publishedAt ? researchItem.publishedAt.split('T')[0] : ''
    });
    setSelectedFile(null);
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      authors: '',
      abstract: '',
      keywords: '',
      pdfFile: '',
      category: '',
      year: '',
      isActive: true,
      order: 0,
      publishedAt: ''
    });
    setSelectedFile(null);
    setEditingResearch(null);
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
              <h1 className="text-2xl font-bold text-gray-900">จัดการผลงานวิจัย</h1>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                เพิ่มผลงานวิจัยใหม่
              </button>
            </div>
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingResearch ? 'แก้ไขผลงานวิจัย' : 'เพิ่มผลงานวิจัยใหม่'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      ชื่อหัวข้อวิจัย *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="กรอกชื่อหัวข้อวิจัย"
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
                    placeholder="กรอกคำอธิบายผลงานวิจัย"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      ผู้วิจัย (คั่นด้วยจุลภาค)
                    </label>
                    <input
                      type="text"
                      value={formData.authors}
                      onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ชื่อผู้วิจัย 1, ชื่อผู้วิจัย 2"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      ปีที่เผยแพร่
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2024"
                      min="1900"
                      max={new Date().getFullYear() + 5}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    บทคัดย่อ
                  </label>
                  <textarea
                    value={formData.abstract}
                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="กรอกบทคัดย่อ"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      คำสำคัญ (คั่นด้วยจุลภาค)
                    </label>
                    <input
                      type="text"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="คำสำคัญ 1, คำสำคัญ 2"
                    />
                  </div>
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
                      <option value="การท่องเที่ยว">การท่องเที่ยว</option>
                      <option value="วัฒนธรรม">วัฒนธรรม</option>
                      <option value="สังคมศาสตร์">สังคมศาสตร์</option>
                      <option value="สิ่งแวดล้อม">สิ่งแวดล้อม</option>
                      <option value="เศรษฐกิจ">เศรษฐกิจ</option>
                      <option value="เทคโนโลยี">เทคโนโลยี</option>
                      <option value="การศึกษา">การศึกษา</option>
                      <option value="สุขภาพ">สุขภาพ</option>
                    </select>
                  </div>
                </div>

                {/* PDF Upload Section */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    ไฟล์ PDF *
                  </label>
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="block w-full text-base text-gray-900 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="mt-1 text-sm text-gray-600">
                        รองรับไฟล์ PDF ขนาดไม่เกิน 10MB
                      </p>
                    </div>

                    {/* Manual URL Input (for editing existing research) */}
                    {editingResearch && !selectedFile && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          หรือกรอก URL ไฟล์ PDF
                        </label>
                        <input
                          type="url"
                          value={formData.pdfFile}
                          onChange={(e) => setFormData({ ...formData, pdfFile: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://example.com/research.pdf"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันที่เผยแพร่
                  </label>
                  <input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    แสดงผลงานวิจัย
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
                      editingResearch ? 'อัปเดต' : 'สร้าง'
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

          {/* Research List */}
          <div className="px-6 py-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่อหัวข้อวิจัย
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ผู้วิจัย
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      หมวดหมู่
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ปี
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {research.map((researchItem) => (
                    <tr key={researchItem._id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {researchItem.title}
                          </div>
                          {researchItem.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {researchItem.description}
                            </div>
                          )}
                          <a
                            href={researchItem.pdfFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            ดูไฟล์ PDF →
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {researchItem.authors ? researchItem.authors.join(', ') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {researchItem.category || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {researchItem.year || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${researchItem.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {researchItem.isActive ? 'แสดง' : 'ซ่อน'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(researchItem)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDelete(researchItem._id)}
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

              {research.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">ยังไม่มีผลงานวิจัย</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
