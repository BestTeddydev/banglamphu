'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentPage({ params, searchParams }: { 
  params: { id: string }, 
  searchParams: { bookingId: string } 
}) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'qr_code' | 'bank_transfer'>('qr_code');
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock booking data
  const bookingData = {
    id: searchParams.bookingId,
    packageName: "ทัวร์วัฒนธรรมบางลำพู",
    totalPrice: 1000,
    participants: 2,
    tourDate: "2024-02-20",
    customerName: "นายสมชาย ใจดี"
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentSlip(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ส่งสลิปสำเร็จ!</h2>
            <p className="text-gray-600 mb-6">
              เราได้รับสลิปการโอนเงินของคุณแล้ว จะตรวจสอบและยืนยันการจองภายใน 24 ชั่วโมง
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/tourism/packages')}
                className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                กลับไปดูแพ็คเกจอื่น
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                กลับหน้าแรก
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">ชำระเงิน</h1>
          <p className="text-gray-600">เลือกวิธีการชำระเงินและอัพโหลดสลิปการโอนเงิน</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">ข้อมูลการชำระเงิน</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    เลือกวิธีการชำระเงิน
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="qr_code"
                        checked={paymentMethod === 'qr_code'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'qr_code')}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">QR Code</div>
                        <div className="text-sm text-gray-600">สแกน QR Code เพื่อชำระเงิน</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'bank_transfer')}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">โอนเงินผ่านธนาคาร</div>
                        <div className="text-sm text-gray-600">โอนเงินเข้าบัญชีธนาคาร</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* QR Code Payment */}
                {paymentMethod === 'qr_code' && (
                  <div className="border border-gray-300 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">QR Code สำหรับชำระเงิน</h3>
                    <div className="text-center">
                      <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📱</div>
                          <div className="text-sm text-gray-600">QR Code</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        สแกน QR Code ด้วยแอปธนาคารหรือแอปชำระเงิน
                      </p>
                      <div className="bg-gray-100 rounded-lg p-4 text-left">
                        <div className="text-sm font-medium mb-2">ข้อมูลการโอน:</div>
                        <div className="text-sm space-y-1">
                          <div>จำนวนเงิน: ฿{bookingData.totalPrice}</div>
                          <div>หมายเหตุ: Booking #{bookingData.id}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Payment */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="border border-gray-300 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">ข้อมูลบัญชีธนาคาร</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">ธนาคาร:</span> กสิกรไทย
                          </div>
                          <div>
                            <span className="font-medium">สาขา:</span> สาขาบางลำพู
                          </div>
                          <div>
                            <span className="font-medium">ชื่อบัญชี:</span> ชุมชนบางลำพู
                          </div>
                          <div>
                            <span className="font-medium">เลขบัญชี:</span> 123-4-56789-0
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="text-sm text-yellow-800">
                          <div className="font-medium mb-2">หมายเหตุสำคัญ:</div>
                          <ul className="space-y-1">
                            <li>• กรุณาโอนเงินจำนวน ฿{bookingData.totalPrice}</li>
                            <li>• ใส่หมายเหตุ: Booking #{bookingData.id}</li>
                            <li>• อัพโหลดสลิปการโอนเงินด้านล่าง</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Slip Upload */}
                <div>
                  <label htmlFor="paymentSlip" className="block text-sm font-medium text-gray-700 mb-2">
                    อัพโหลดสลิปการโอนเงิน *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="paymentSlip"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <label htmlFor="paymentSlip" className="cursor-pointer">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="text-sm text-gray-600">
                        {paymentSlip ? (
                          <div>
                            <div className="font-medium text-green-600">✓ เลือกไฟล์แล้ว</div>
                            <div className="text-gray-500">{paymentSlip.name}</div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium">คลิกเพื่อเลือกไฟล์</div>
                            <div className="text-gray-500">รองรับไฟล์ JPG, PNG, PDF</div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !paymentSlip}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400 transition-colors duration-200"
                >
                  {isSubmitting ? 'กำลังส่งสลิป...' : 'ส่งสลิปการโอนเงิน'}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">สรุปการจอง</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900">{bookingData.packageName}</h4>
                  <p className="text-sm text-gray-600">วันที่เดินทาง: {bookingData.tourDate}</p>
                  <p className="text-sm text-gray-600">ผู้จอง: {bookingData.customerName}</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">จำนวนคน</span>
                    <span className="font-semibold">{bookingData.participants} คน</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-green-600 border-t pt-2">
                    <span>ยอดชำระ</span>
                    <span>฿{bookingData.totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">หมายเลขการจอง</h4>
                <div className="text-lg font-mono text-blue-800">#{bookingData.id}</div>
                <p className="text-sm text-blue-700 mt-2">
                  กรุณาเก็บหมายเลขนี้ไว้เพื่อติดตามสถานะการจอง
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
