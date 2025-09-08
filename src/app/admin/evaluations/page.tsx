'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Evaluation {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  targetType: string;
  targetId: string;
  targetName: string;
  rating: number;
  comment?: string;
  images?: string[];
  isActive: boolean;
  createdAt: string;
}

export default function EvaluationsPage() {
  const { user, isAdmin } = useAuth();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTargetType, setSelectedTargetType] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchEvaluations();
    }
  }, [isAdmin]);

  const fetchEvaluations = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedTargetType) params.append('targetType', selectedTargetType);
      if (selectedRating) params.append('rating', selectedRating);
      
      const response = await fetch(`/api/admin/evaluations?${params}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvaluations(data.evaluations);
      }
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setLoading(true);
    fetchEvaluations();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบการประเมินนี้?')) return;
    
    try {
      const response = await fetch(`/api/admin/evaluations/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setEvaluations(evaluations.filter(evaluation => evaluation._id !== id));
      }
    } catch (error) {
      console.error('Error deleting evaluation:', error);
    }
  };

  const getTargetTypeText = (type: string) => {
    switch (type) {
      case 'attraction': return 'แหล่งท่องเที่ยว';
      case 'restaurant': return 'ร้านอาหาร';
      case 'package': return 'แพ็คเกจทัวร์';
      default: return type;
    }
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">จัดการการประเมิน</h1>
              <p className="text-gray-600 mt-1">จัดการการประเมินจากผู้ใช้</p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภท
              </label>
              <select
                value={selectedTargetType}
                onChange={(e) => setSelectedTargetType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">ทั้งหมด</option>
                <option value="attraction">แหล่งท่องเที่ยว</option>
                <option value="restaurant">ร้านอาหาร</option>
                <option value="package">แพ็คเกจทัวร์</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                คะแนน
              </label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">ทั้งหมด</option>
                <option value="5">5 ดาว</option>
                <option value="4">4 ดาว</option>
                <option value="3">3 ดาว</option>
                <option value="2">2 ดาว</option>
                <option value="1">1 ดาว</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                กรอง
              </button>
            </div>
          </div>
        </div>

        {/* Evaluations List */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">กำลังโหลด...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ผู้ประเมิน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ประเภท
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่อ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      คะแนน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ความคิดเห็น
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {evaluations.map((evaluation) => (
                    <tr key={evaluation._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{evaluation.userId.name}</div>
                        <div className="text-sm text-gray-500">{evaluation.userId.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getTargetTypeText(evaluation.targetType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {evaluation.targetName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-yellow-400 text-lg">{getRatingStars(evaluation.rating)}</span>
                          <span className="ml-2 text-sm text-gray-600">({evaluation.rating}/5)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {evaluation.comment || '-'}
                        </div>
                        {evaluation.images && evaluation.images.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            รูปภาพ: {evaluation.images.length} รูป
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(evaluation.createdAt).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(evaluation._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {evaluations.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  ไม่พบการประเมิน
                </div>
              )}
            </div>
          )}
        </div>

        {/* Back to Admin */}
        <div className="mt-8 text-center">
          <Link
            href="/admin"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            กลับไประบบจัดการ
          </Link>
        </div>
      </div>
    </div>
  );
}
