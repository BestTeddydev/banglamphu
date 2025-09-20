'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminPage() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const response = await fetch('/api/auth/check-admin', {
          credentials: 'include'
        });

        if (!response.ok) {
          router.push('/');
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Admin check failed:', error);
        router.push('/');
      }
    };

    checkAdminAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบสิทธิ์การเข้าถึง...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ระบบจัดการข้อมูล</h1>
              <p className="text-gray-600 mt-1">จัดการข้อมูลแหล่งท่องเที่ยว ร้านอาหาร และแพ็คเกจทัวร์</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">ยินดีต้อนรับ, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">แหล่งท่องเที่ยว</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ร้านอาหาร</p>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">แพ็คเกจทัวร์</p>
                <p className="text-2xl font-semibold text-gray-900">5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">การจอง</p>
                <p className="text-2xl font-semibold text-gray-900">23</p>
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Attractions Management */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">แหล่งท่องเที่ยว</h3>
                  <p className="text-sm text-gray-600">จัดการข้อมูลสถานที่ท่องเที่ยว</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/admin/attractions" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  ดูรายการทั้งหมด
                </Link>
                <Link href="/admin/attractions/create" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  เพิ่มแหล่งท่องเที่ยวใหม่
                </Link>
              </div>
            </div>
          </div>

          {/* Restaurants Management */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">ร้านอาหาร</h3>
                  <p className="text-sm text-gray-600">จัดการข้อมูลร้านอาหารและเมนู</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/admin/restaurants" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  ดูรายการทั้งหมด
                </Link>
                <Link href="/admin/restaurants/create" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  เพิ่มร้านอาหารใหม่
                </Link>
              </div>
            </div>
          </div>

          {/* Tour Packages Management */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">แพ็คเกจทัวร์</h3>
                  <p className="text-sm text-gray-600">จัดการแพ็คเกจทัวร์และกิจกรรม</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/admin/packages" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  ดูรายการทั้งหมด
                </Link>
                <Link href="/admin/packages/create" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  สร้างแพ็คเกจใหม่
                </Link>
              </div>
            </div>
          </div>

          {/* Bookings Management */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">การจอง</h3>
                  <p className="text-sm text-gray-600">จัดการการจองและชำระเงิน</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/admin/bookings" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  ดูรายการจองทั้งหมด
                </Link>
                <Link href="/admin/bookings/pending" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  รอการยืนยัน
                </Link>
              </div>
            </div>
          </div>

          {/* Evaluations Management */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">แบบประเมิน</h3>
                  <p className="text-sm text-gray-600">จัดการแบบประเมินและผลตอบรับ</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/admin/evaluations" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  ดูผลประเมินทั้งหมด
                </Link>
                <Link href="/admin/evaluations/create" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  สร้างแบบประเมินใหม่
                </Link>
              </div>
            </div>
          </div>

          {/* Stories Management */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">ประวัติศาสตร์</h3>
                  <p className="text-sm text-gray-600">จัดการเรื่องเล่าประวัติศาสตร์</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/admin/stories" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  ดูรายการประวัติศาสตร์ทั้งหมด
                </Link>
                <Link href="/admin/stories/create" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  สร้างเรื่องประวัติศาสตร์ใหม่
                </Link>
              </div>
            </div>
          </div>

          {/* Banners Management */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">แบนเนอร์</h3>
                  <p className="text-sm text-gray-600">จัดการแบนเนอร์หน้าแรก</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/admin/banners" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  จัดการแบนเนอร์
                </Link>
              </div>
            </div>
          </div>

          {/* News Management */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">ข่าวสาร</h3>
                  <p className="text-sm text-gray-600">จัดการข่าวสารและบทความ</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/admin/news" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  จัดการข่าวสาร
                </Link>
              </div>
            </div>
          </div>

          {/* Research Management */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">ผลงานวิจัย</h3>
                  <p className="text-sm text-gray-600">จัดการผลงานวิจัยและเอกสารวิชาการ</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/admin/research" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  จัดการผลงานวิจัย
                </Link>
              </div>
            </div>
          </div>

          {/* Highlights Management */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">ไฮไลท์</h3>
                  <p className="text-sm text-gray-600">จัดการคลิปไฮไลท์และวิดีโอ</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/admin/highlights" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  จัดการไฮไลท์
                </Link>
              </div>
            </div>
          </div>

          {/* Souvenirs Management */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">สินค้าที่ระลึก</h3>
                  <p className="text-sm text-gray-600">จัดการสินค้าที่ระลึกและของฝาก</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/admin/souvenirs" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  จัดการสินค้าที่ระลึก
                </Link>
              </div>
            </div>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">รายงาน</h3>
                  <p className="text-sm text-gray-600">ดูรายงานและสถิติต่างๆ</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/admin/reports/bookings" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  รายงานการจอง
                </Link>
                <Link href="/admin/reports/revenue" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  รายงานรายได้
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">กิจกรรมล่าสุด</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">มีการจองแพ็คเกจทัวร์วัฒนธรรมใหม่</span>
                </div>
                <span className="text-xs text-gray-500">2 นาทีที่แล้ว</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">เพิ่มร้านอาหารใหม่: ร้านชาบางลำพู</span>
                </div>
                <span className="text-xs text-gray-500">1 ชั่วโมงที่แล้ว</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">อัพเดทข้อมูลวัดบางลำพู</span>
                </div>
                <span className="text-xs text-gray-500">3 ชั่วโมงที่แล้ว</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
