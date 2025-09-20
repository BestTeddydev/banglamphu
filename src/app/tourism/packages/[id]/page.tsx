'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Package {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  maxParticipants: number;
  includes: string[];
  itinerary: {
    time: string;
    activity: string;
    location: string;
  }[];
  images: string[];
  category: string;
  difficulty: string;
  rating: number;
  reviewCount: number;
  tourDates: {
    date: Date;
    startTime: string;
    endTime: string;
    availableSlots: number;
  }[];
}

export default function PackageDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();

  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    tourDate: '',
    participants: 1,
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      emergencyContact: '',
      specialRequests: ''
    }
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchPackage();
  }, [params.id]);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/packages/${params.id}`);

      if (response.ok) {
        const data = await response.json();
        setPackageData(data.package);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'ไม่สามารถโหลดข้อมูลได้');
      }
    } catch (error) {
      console.error('Error fetching package:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('กรุณาเข้าสู่ระบบก่อนจองทัวร์');
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: params.id,
          userId: user.id,
          tourDate: {
            date: bookingData.tourDate
          },
          participants: bookingData.participants,
          contactInfo: bookingData.contactInfo
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/tourism/bookings/${data.booking._id}`);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'เกิดข้อผิดพลาดในการจองทัวร์');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('เกิดข้อผิดพลาดในการจองทัวร์');
    } finally {
      setBookingLoading(false);
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'ง่าย';
      case 'moderate': return 'ปานกลาง';
      case 'hard': return 'ยาก';
      default: return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
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

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-4">{error || 'ไม่พบแพ็คเกจทัวร์'}</p>
          <Link
            href="/tourism/packages"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            กลับไปหน้าแพ็คเกจ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/tourism" className="hover:text-green-600">ท่องเที่ยว</Link>
          <span>›</span>
          <Link href="/tourism/packages" className="hover:text-green-600">แพ็คเกจทัวร์</Link>
          <span>›</span>
          <span className="text-gray-900">{packageData.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Package Images */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                {packageData.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${packageData.name} ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Package Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{packageData.name}</h1>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {packageData.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(packageData.difficulty)}`}>
                    {getDifficultyText(packageData.difficulty)}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-lg mb-6">{packageData.description}</p>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(packageData.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-lg text-gray-600">
                  {packageData.rating.toFixed(1)} ({packageData.reviewCount} รีวิว)
                </span>
              </div>

              {/* Package Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">{packageData.duration} ชั่วโมง</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-gray-600">สูงสุด {packageData.maxParticipants} คน</span>
                </div>
              </div>

              {/* Includes */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">สิ่งที่รวมในแพ็คเกจ</h3>
                <ul className="space-y-2">
                  {packageData.includes.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Itinerary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">กำหนดการทัวร์</h3>
                <div className="space-y-4">
                  {packageData.itinerary.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-20 text-sm font-medium text-gray-900">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.activity}</h4>
                        <p className="text-sm text-gray-600">{item.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ฿{packageData.price.toLocaleString()}
                </div>
                <div className="text-gray-600">ต่อคน</div>
              </div>

              {/* Tour Dates */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">วันที่จัดทัวร์</h3>
                <div className="space-y-2">
                  {packageData.tourDates.map((tourDate, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="font-medium text-gray-900">
                        {formatDate(tourDate.date)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {tourDate.startTime} - {tourDate.endTime}
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        เหลือ {tourDate.availableSlots} ที่
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Button */}
              {user ? (
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
                >
                  จองทัวร์
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors duration-200 text-center block"
                >
                  เข้าสู่ระบบเพื่อจองทัวร์
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">จองทัวร์</h2>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      วันที่ทัวร์ *
                    </label>
                    <select
                      value={bookingData.tourDate}
                      onChange={(e) => setBookingData(prev => ({ ...prev, tourDate: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">เลือกวันที่</option>
                      {packageData.tourDates.map((tourDate, index) => {
                        const dateStr = tourDate.date instanceof Date
                          ? tourDate.date.toISOString().split('T')[0]
                          : new Date(tourDate.date).toISOString().split('T')[0];
                        return (
                          <option key={index} value={dateStr}>
                            {formatDate(tourDate.date)} - {tourDate.startTime} ถึง {tourDate.endTime}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      จำนวนคน *
                    </label>
                    <input
                      type="number"
                      value={bookingData.participants}
                      onChange={(e) => setBookingData(prev => ({ ...prev, participants: parseInt(e.target.value) || 1 }))}
                      required
                      min="1"
                      max={packageData.maxParticipants}
                      className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      ชื่อ-นามสกุล *
                    </label>
                    <input
                      type="text"
                      value={bookingData.contactInfo.name}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, name: e.target.value }
                      }))}
                      required
                      className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      อีเมล *
                    </label>
                    <input
                      type="email"
                      value={bookingData.contactInfo.email}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, email: e.target.value }
                      }))}
                      required
                      className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      เบอร์โทรศัพท์ *
                    </label>
                    <input
                      type="tel"
                      value={bookingData.contactInfo.phone}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, phone: e.target.value }
                      }))}
                      required
                      className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      เบอร์ติดต่อฉุกเฉิน
                    </label>
                    <input
                      type="tel"
                      value={bookingData.contactInfo.emergencyContact}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, emergencyContact: e.target.value }
                      }))}
                      className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      แพ้อาหาร(ถ้ามี)
                    </label>
                    <textarea
                      value={bookingData.contactInfo.specialRequests}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, specialRequests: e.target.value }
                      }))}
                      rows={3}
                      className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">รวมทั้งสิ้น</span>
                      <span className="text-xl font-bold text-green-600">
                        ฿{(packageData.price * bookingData.participants).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-400"
                    >
                      {bookingLoading ? 'กำลังจอง...' : 'ยืนยันการจอง'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
