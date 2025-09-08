'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Booking {
  _id: string;
  packageId: {
    _id: string;
    name: string;
    price: number;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  participants: number;
  bookingDate: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  specialRequests?: string;
  notes?: string;
  createdAt: string;
}

export default function BookingsPage() {
  const { user, isAdmin } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchBookings();
    }
  }, [isAdmin]);

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedStatus) params.append('status', selectedStatus);
      if (selectedPaymentStatus) params.append('paymentStatus', selectedPaymentStatus);
      
      const response = await fetch(`/api/admin/bookings?${params}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setLoading(true);
    fetchBookings();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        setBookings(bookings.map(booking => 
          booking._id === id ? { ...booking, status: newStatus } : booking
        ));
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handlePaymentStatusChange = async (id: string, newPaymentStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      
      if (response.ok) {
        setBookings(bookings.map(booking => 
          booking._id === id ? { ...booking, paymentStatus: newPaymentStatus } : booking
        ));
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'รอดำเนินการ';
      case 'confirmed': return 'ยืนยันแล้ว';
      case 'cancelled': return 'ยกเลิก';
      case 'completed': return 'เสร็จสิ้น';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'รอชำระ';
      case 'paid': return 'ชำระแล้ว';
      case 'refunded': return 'คืนเงิน';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">จัดการรายการจอง</h1>
              <p className="text-gray-600 mt-1">จัดการรายการจองแพ็คเกจทัวร์</p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สถานะการจอง
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">ทั้งหมด</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="confirmed">ยืนยันแล้ว</option>
                <option value="cancelled">ยกเลิก</option>
                <option value="completed">เสร็จสิ้น</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สถานะการชำระเงิน
              </label>
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">ทั้งหมด</option>
                <option value="pending">รอชำระ</option>
                <option value="paid">ชำระแล้ว</option>
                <option value="refunded">คืนเงิน</option>
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

        {/* Bookings List */}
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
                      รหัสจอง
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      แพ็คเกจ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ลูกค้า
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จำนวนคน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่จอง
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ราคารวม
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การชำระเงิน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{booking._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.packageId.name}</div>
                        <div className="text-sm text-gray-500">฿{booking.packageId.price.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.customerInfo.name}</div>
                        <div className="text-sm text-gray-500">{booking.customerInfo.email}</div>
                        <div className="text-sm text-gray-500">{booking.customerInfo.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.participants} คน
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.bookingDate).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ฿{booking.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(booking.status)}`}
                        >
                          <option value="pending">รอดำเนินการ</option>
                          <option value="confirmed">ยืนยันแล้ว</option>
                          <option value="cancelled">ยกเลิก</option>
                          <option value="completed">เสร็จสิ้น</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={booking.paymentStatus}
                          onChange={(e) => handlePaymentStatusChange(booking._id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border-0 ${getPaymentStatusColor(booking.paymentStatus)}`}
                        >
                          <option value="pending">รอชำระ</option>
                          <option value="paid">ชำระแล้ว</option>
                          <option value="refunded">คืนเงิน</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/admin/bookings/${booking._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ดูรายละเอียด
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {bookings.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  ไม่พบรายการจอง
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
