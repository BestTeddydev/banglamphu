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

export default function AdminBookingDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (user) {
      fetchBooking();
    }
  }, [user, params.id]);

  useEffect(() => {
    if (booking) {
      setStatus(booking.status);
      setPaymentStatus(booking.paymentStatus);
      setNotes(booking.notes || '');
    }
  }, [booking]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/bookings/${params.id}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'ไม่สามารถโหลดข้อมูลได้');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    
    try {
      const response = await fetch(`/api/admin/bookings/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          status,
          paymentStatus,
          notes
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);
        alert('อัพเดทข้อมูลเรียบร้อยแล้ว');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'เกิดข้อผิดพลาดในการอัพเดท');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดท');
    } finally {
      setUpdating(false);
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
      month: 'long',
      day: 'numeric'
    });
  };

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

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-4">{error || 'ไม่พบข้อมูลการจอง'}</p>
          <Link
            href="/admin/bookings"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            กลับไปหน้ารายการการจอง
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/admin" className="hover:text-green-600">แอดมิน</Link>
          <span>›</span>
          <Link href="/admin/bookings" className="hover:text-green-600">จัดการการจอง</Link>
          <span>›</span>
          <span className="text-gray-900">รายละเอียดการจอง</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">รายละเอียดการจอง</h1>
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                    {getPaymentStatusText(booking.paymentStatus)}
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>หมายเลขการจอง: <span className="font-medium">{booking._id}</span></p>
                <p>วันที่จอง: <span className="font-medium">{formatDate(new Date(booking.createdAt))}</span></p>
              </div>
            </div>

            {/* Package Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">ข้อมูลแพ็คเกจ</h2>
              <div className="flex items-start space-x-4">
                <img
                  src={(booking.packageId.images && booking.packageId.images[0]) || '/placeholder-package.jpg'}
                  alt={booking.packageId.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{booking.packageId.name || 'ไม่ระบุชื่อ'}</h3>
                  <p className="text-gray-600 mb-2">{booking.packageId.category || 'ไม่ระบุหมวดหมู่'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      ฿{(booking.packageId.price || 0).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">ต่อคน</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tour Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">รายละเอียดทัวร์</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">วันที่ทัวร์</h3>
                  <p className="text-gray-600">{formatDate(booking.tourDate.date)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">เวลา</h3>
                  <p className="text-gray-600">{booking.tourDate.startTime} - {booking.tourDate.endTime}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">จำนวนคน</h3>
                  <p className="text-gray-600">{booking.participants} คน</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">ราคารวม</h3>
                  <p className="text-2xl font-bold text-green-600">฿{booking.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">ข้อมูลติดต่อ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">ชื่อ-นามสกุล</h3>
                  <p className="text-gray-600">{booking.contactInfo.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">อีเมล</h3>
                  <p className="text-gray-600">{booking.contactInfo.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">เบอร์โทรศัพท์</h3>
                  <p className="text-gray-600">{booking.contactInfo.phone}</p>
                </div>
                {booking.contactInfo.emergencyContact && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">เบอร์ติดต่อฉุกเฉิน</h3>
                    <p className="text-gray-600">{booking.contactInfo.emergencyContact}</p>
                  </div>
                )}
              </div>
              {booking.contactInfo.specialRequests && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">ข้อความพิเศษ</h3>
                  <p className="text-gray-600">{booking.contactInfo.specialRequests}</p>
                </div>
              )}
            </div>
          </div>

          {/* Management Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">จัดการการจอง</h2>
              
              {/* Status Management */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">สถานะการจอง</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="pending">รอดำเนินการ</option>
                    <option value="confirmed">ยืนยันแล้ว</option>
                    <option value="cancelled">ยกเลิก</option>
                    <option value="completed">เสร็จสิ้น</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">สถานะการชำระเงิน</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="pending">รอชำระเงิน</option>
                    <option value="paid">ชำระเงินแล้ว</option>
                    <option value="failed">ชำระเงินไม่สำเร็จ</option>
                    <option value="refunded">คืนเงินแล้ว</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">หมายเหตุ</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="เพิ่มหมายเหตุ..."
                  />
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                >
                  {updating ? 'กำลังอัพเดท...' : 'อัพเดทข้อมูล'}
                </button>
              </div>

              {/* Payment Slip */}
              {booking.paymentSlip && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">สลิปโอนเงิน</h3>
                  <div className="space-y-2">
                    <img
                      src={booking.paymentSlip}
                      alt="Payment Slip"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <a
                      href={booking.paymentSlip}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      ดูรูปภาพขนาดเต็ม
                    </a>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-6 space-y-2">
                <Link
                  href={`/tourism/bookings/${booking._id}`}
                  className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  ดูหน้ารายละเอียดลูกค้า
                </Link>
                <Link
                  href="/admin/bookings"
                  className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-700"
                >
                  กลับไปหน้ารายการ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
