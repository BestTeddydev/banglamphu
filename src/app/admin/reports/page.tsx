'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface ReportData {
  totalAttractions: number;
  totalRestaurants: number;
  totalPackages: number;
  totalBookings: number;
  totalEvaluations: number;
  recentBookings: any[];
  topRatedAttractions: any[];
  topRatedRestaurants: any[];
  bookingStats: {
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };
  paymentStats: {
    pending: number;
    paid: number;
    refunded: number;
  };
}

export default function ReportsPage() {
  const { user, isAdmin } = useAuth();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchReportData();
    }
  }, [isAdmin]);

  const fetchReportData = async () => {
    try {
      // This would normally fetch from API endpoints
      // For now, we'll use mock data
      const mockData: ReportData = {
        totalAttractions: 12,
        totalRestaurants: 8,
        totalPackages: 5,
        totalBookings: 45,
        totalEvaluations: 23,
        recentBookings: [
          { id: '1', packageName: 'ทัวร์วัดบางลำพู', customerName: 'สมชาย ใจดี', date: '2024-01-15', status: 'confirmed' },
          { id: '2', packageName: 'ทัวร์ตลาดบางลำพู', customerName: 'สมหญิง รักดี', date: '2024-01-14', status: 'pending' },
          { id: '3', packageName: 'ทัวร์อาหารบางลำพู', customerName: 'สมศักดิ์ เก่งดี', date: '2024-01-13', status: 'completed' },
        ],
        topRatedAttractions: [
          { name: 'วัดบางลำพู', rating: 4.8, reviewCount: 15 },
          { name: 'ตลาดบางลำพู', rating: 4.6, reviewCount: 12 },
          { name: 'พิพิธภัณฑ์ชุมชนบางลำพู', rating: 4.4, reviewCount: 8 },
        ],
        topRatedRestaurants: [
          { name: 'ร้านอาหารบ้านบางลำพู', rating: 4.7, reviewCount: 18 },
          { name: 'ร้านขนมโบราณบางลำพู', rating: 4.5, reviewCount: 14 },
          { name: 'ร้านชาบางลำพู', rating: 4.3, reviewCount: 10 },
        ],
        bookingStats: {
          pending: 8,
          confirmed: 25,
          cancelled: 3,
          completed: 9
        },
        paymentStats: {
          pending: 8,
          paid: 34,
          refunded: 3
        }
      };
      
      setReportData(mockData);
    } catch (error) {
      console.error('Error fetching report data:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดรายงาน...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">รายงานและสถิติ</h1>
          <p className="text-gray-600 mt-1">ภาพรวมการใช้งานระบบจัดการข้อมูลชุมชนบางลำพู</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                <p className="text-2xl font-semibold text-gray-900">{reportData?.totalAttractions}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{reportData?.totalRestaurants}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">แพ็คเกจทัวร์</p>
                <p className="text-2xl font-semibold text-gray-900">{reportData?.totalPackages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">รายการจอง</p>
                <p className="text-2xl font-semibold text-gray-900">{reportData?.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">การประเมิน</p>
                <p className="text-2xl font-semibold text-gray-900">{reportData?.totalEvaluations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Booking Status Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">สถานะการจอง</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">รอดำเนินการ</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(reportData?.bookingStats.pending || 0) / (reportData?.totalBookings || 1) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{reportData?.bookingStats.pending}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ยืนยันแล้ว</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(reportData?.bookingStats.confirmed || 0) / (reportData?.totalBookings || 1) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{reportData?.bookingStats.confirmed}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ยกเลิก</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(reportData?.bookingStats.cancelled || 0) / (reportData?.totalBookings || 1) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{reportData?.bookingStats.cancelled}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">เสร็จสิ้น</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(reportData?.bookingStats.completed || 0) / (reportData?.totalBookings || 1) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{reportData?.bookingStats.completed}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">สถานะการชำระเงิน</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">รอชำระ</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(reportData?.paymentStats.pending || 0) / (reportData?.totalBookings || 1) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{reportData?.paymentStats.pending}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ชำระแล้ว</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(reportData?.paymentStats.paid || 0) / (reportData?.totalBookings || 1) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{reportData?.paymentStats.paid}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">คืนเงิน</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(reportData?.paymentStats.refunded || 0) / (reportData?.totalBookings || 1) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{reportData?.paymentStats.refunded}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings and Top Rated */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">รายการจองล่าสุด</h3>
            <div className="space-y-3">
              {reportData?.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.packageName}</p>
                    <p className="text-xs text-gray-500">{booking.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{booking.date}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status === 'confirmed' ? 'ยืนยันแล้ว' :
                       booking.status === 'pending' ? 'รอดำเนินการ' :
                       'เสร็จสิ้น'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Rated */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">แหล่งท่องเที่ยวยอดนิยม</h3>
            <div className="space-y-3">
              {reportData?.topRatedAttractions.map((attraction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{attraction.name}</p>
                    <p className="text-xs text-gray-500">{attraction.reviewCount} รีวิว</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-medium text-gray-900 ml-1">{attraction.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back to Admin */}
        <div className="text-center">
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
