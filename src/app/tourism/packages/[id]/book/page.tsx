'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookPackagePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    participants: 1,
    tourDate: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'qr_code' | 'bank_transfer'>('qr_code');

  // Mock package data
  const packageData = {
    id: params.id,
    name: "ทัวร์วัฒนธรรมบางลำพู",
    price: 500,
    duration: 4,
    maxParticipants: 20,
    currentParticipants: 8,
    meetingPoint: "หน้าสถานีรถไฟบางลำพู",
    meetingTime: "08:00"
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);

    // Navigate to payment page
    router.push(`/tourism/packages/${params.id}/payment?bookingId=12345`);
  };

  const totalPrice = packageData.price * formData.participants;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">จองแพ็คเกจทัวร์</h1>
          <p className="text-gray-600">กรอกข้อมูลเพื่อจองแพ็คเกจทัวร์ของคุณ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">ข้อมูลการจอง</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-base font-semibold text-gray-800 mb-2">
                      ชื่อ-นามสกุล *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="กรุณากรอกชื่อ-นามสกุล"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-base font-semibold text-gray-800 mb-2">
                      อีเมล *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-base font-semibold text-gray-800 mb-2">
                      เบอร์โทรศัพท์ *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="081-xxx-xxxx"
                    />
                  </div>

                  <div>
                    <label htmlFor="participants" className="block text-base font-semibold text-gray-800 mb-2">
                      จำนวนผู้เข้าร่วม *
                    </label>
                    <select
                      id="participants"
                      name="participants"
                      required
                      value={formData.participants}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {Array.from({ length: Math.min(10, packageData.maxParticipants - packageData.currentParticipants) }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} คน</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="tourDate" className="block text-base font-semibold text-gray-800 mb-2">
                    วันที่เดินทาง *
                  </label>
                  <input
                    type="date"
                    id="tourDate"
                    name="tourDate"
                    required
                    value={formData.tourDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-base font-semibold text-gray-800 mb-2">
                    หมายเหตุเพิ่มเติม
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="กรุณาระบุความต้องการพิเศษหรือข้อมูลเพิ่มเติม"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400 transition-colors duration-200"
                >
                  {isSubmitting ? 'กำลังดำเนินการ...' : 'ดำเนินการจอง'}
                </button>
              </form>
            </div>
          </div>

          {/* Package Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">สรุปการจอง</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900">{packageData.name}</h4>
                  <p className="text-sm text-gray-600">ระยะเวลา: {packageData.duration} ชั่วโมง</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">ราคาต่อคน</span>
                    <span className="font-semibold">฿{packageData.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">จำนวนคน</span>
                    <span className="font-semibold">{formData.participants} คน</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-green-600 border-t pt-2">
                    <span>รวมทั้งสิ้น</span>
                    <span>฿{totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  พบกันเวลา {packageData.meetingTime}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {packageData.meetingPoint}
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">รวมในแพ็คเกจ</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• ไกด์ท้องถิ่น</li>
                  <li>• อาหารกลางวัน</li>
                  <li>• ค่าเข้าพิพิธภัณฑ์</li>
                  <li>• ประกันการเดินทาง</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
