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
    images: string[];
    category: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  tourDate: {
    date: Date;
    startTime: string;
    endTime: string;
  };
  participants: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'bank_transfer' | 'credit_card' | 'cash';
  paymentSlip?: string;
  paymentDate?: Date;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    emergencyContact?: string;
    specialRequests?: string;
  };
  notes?: string;
  createdAt: string;
}

interface GroupedBookings {
  [packageId: string]: {
    package: {
      _id: string;
      name: string;
      price: number;
      images: string[];
      category: string;
    };
    bookings: Booking[];
  };
}

export default function AdminBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [groupedBookings, setGroupedBookings] = useState<GroupedBookings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  useEffect(() => {
    groupBookingsByPackage();
  }, [bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (paymentStatusFilter) params.append('paymentStatus', paymentStatusFilter);
      
      const response = await fetch(`/api/admin/bookings?${params}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'ไม่สามารถโหลดข้อมูลได้');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  const groupBookingsByPackage = () => {
    const grouped: GroupedBookings = {};
    
    bookings.forEach(booking => {
      const packageId = booking.packageId._id;
      if (!grouped[packageId]) {
        grouped[packageId] = {
          package: booking.packageId,
          bookings: []
        };
      }
      grouped[packageId].bookings.push(booking);
    });
    
    setGroupedBookings(grouped);
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string, field: 'status' | 'paymentStatus') => {
    setUpdating(bookingId);
    
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ [field]: newStatus })
      });
      
      if (response.ok) {
        const data = await response.json();
        // อัพเดทข้อมูลใน state
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, [field]: newStatus }
            : booking
        ));
        alert('อัพเดทสถานะเรียบร้อยแล้ว');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'เกิดข้อผิดพลาดในการอัพเดท');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดท');
    } finally {
      setUpdating(null);
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
      case 'pending': return 'รอชำระเงิน';
      case 'paid': return 'ชำระเงินแล้ว';
      case 'failed': return 'ชำระเงินไม่สำเร็จ';
      case 'refunded': return 'คืนเงินแล้ว';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredGroupedBookings = Object.keys(groupedBookings).filter(packageId => {
    if (selectedPackage && packageId !== selectedPackage) return false;
    return true;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-gray-600 mb-4">คุณต้องเข้าสู่ระบบเพื่อเข้าถึงหน้านี้</p>
          <Link href="/auth/login" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            เข้าสู่ระบบ
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
          <button
            onClick={fetchBookings}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">จัดการการจองทัวร์</h1>
          <p className="text-gray-600">ดูและจัดการการจองทัวร์ทั้งหมด</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ตัวกรอง</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">แพ็คเกจ</label>
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">ทั้งหมด</option>
                {Object.values(groupedBookings).map((group) => (
                  <option key={group.package._id} value={group.package._id}>
                    {group.package.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">สถานะการจอง</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">ทั้งหมด</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="confirmed">ยืนยันแล้ว</option>
                <option value="cancelled">ยกเลิก</option>
                <option value="completed">เสร็จสิ้น</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">สถานะการชำระเงิน</label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">ทั้งหมด</option>
                <option value="pending">รอชำระเงิน</option>
                <option value="paid">ชำระเงินแล้ว</option>
                <option value="failed">ชำระเงินไม่สำเร็จ</option>
                <option value="refunded">คืนเงินแล้ว</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchBookings}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                กรองข้อมูล
              </button>
            </div>
          </div>
        </div>

        {/* Bookings by Package */}
        <div className="space-y-6">
          {filteredGroupedBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบการจอง</h3>
              <p className="text-gray-600">ยังไม่มีการจองทัวร์ในระบบ</p>
            </div>
          ) : (
            filteredGroupedBookings.map((packageId) => {
              const group = groupedBookings[packageId];
              return (
                <div key={packageId} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Package Header */}
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={(group.package.images && group.package.images[0]) || '/placeholder-package.jpg'}
                          alt={group.package.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h2 className="text-xl font-bold">{group.package.name || 'ไม่ระบุชื่อ'}</h2>
                          <p className="text-green-100">{group.package.category || 'ไม่ระบุหมวดหมู่'}</p>
                          <p className="text-green-100">฿{(group.package.price || 0).toLocaleString()} ต่อคน</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{group.bookings.length}</p>
                        <p className="text-green-100">การจอง</p>
                      </div>
                    </div>
                  </div>

                  {/* Bookings List */}
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ลูกค้า
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              วันที่ทัวร์
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              จำนวนคน
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ราคารวม
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              สถานะการจอง
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              สถานะการชำระเงิน
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              การจัดการ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {group.bookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {booking.contactInfo.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {booking.contactInfo.email}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {booking.contactInfo.phone}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {formatDate(booking.tourDate.date)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {booking.tourDate.startTime} - {booking.tourDate.endTime}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {booking.participants} คน
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ฿{booking.totalPrice.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={booking.status}
                                  onChange={(e) => handleStatusUpdate(booking._id, e.target.value, 'status')}
                                  disabled={updating === booking._id}
                                  className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    getStatusColor(booking.status)
                                  }`}
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
                                  onChange={(e) => handleStatusUpdate(booking._id, e.target.value, 'paymentStatus')}
                                  disabled={updating === booking._id}
                                  className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    getPaymentStatusColor(booking.paymentStatus)
                                  }`}
                                >
                                  <option value="pending">รอชำระเงิน</option>
                                  <option value="paid">ชำระเงินแล้ว</option>
                                  <option value="failed">ชำระเงินไม่สำเร็จ</option>
                                  <option value="refunded">คืนเงินแล้ว</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Link
                                    href={`/admin/bookings/${booking._id}`}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    ดูรายละเอียด
                                  </Link>
                                  {booking.paymentSlip && (
                                    <a
                                      href={booking.paymentSlip}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      ดูสลิป
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}