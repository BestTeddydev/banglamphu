'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PackagesPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const packagesData = [
    {
      id: 1,
      name: "ทัวร์วัฒนธรรมบางลำพู",
      description: "ทัวร์ครึ่งวันที่พาไปชมวัด ตลาด และพิพิธภัณฑ์ชุมชน พร้อมอาหารกลางวัน",
      images: ["/api/placeholder/400/250"],
      attractions: ["วัดบางลำพู", "ตลาดบางลำพู", "พิพิธภัณฑ์ชุมชน"],
      restaurants: ["ร้านอาหารบ้านบางลำพู"],
      activities: ["ชมวัด", "ช้อปปิ้งตลาด", "เยี่ยมชมพิพิธภัณฑ์"],
      duration: 4,
      price: 500,
      maxParticipants: 20,
      currentParticipants: 8,
      includes: ["ไกด์ท้องถิ่น", "อาหารกลางวัน", "ค่าเข้าพิพิธภัณฑ์", "ประกันการเดินทาง"],
      excludes: ["ค่าเดินทางไป-กลับ", "ของฝาก", "เครื่องดื่มเพิ่มเติม"],
      meetingPoint: {
        address: "หน้าสถานีรถไฟบางลำพู",
        coordinates: { lat: 13.7563, lng: 100.5018 }
      },
      meetingTime: "08:00",
      qrCode: "QR_CODE_1",
      tags: ["วัฒนธรรม", "ครึ่งวัน", "ครอบครัว"]
    },
    {
      id: 2,
      name: "ทัวร์อาหารพื้นบ้าน",
      description: "ทัวร์เต็มวันที่เน้นการชิมอาหารพื้นบ้านและขนมไทย พร้อมเรียนรู้การทำอาหาร",
      images: ["/api/placeholder/400/250"],
      attractions: ["ตลาดบางลำพู"],
      restaurants: ["ร้านอาหารบ้านบางลำพู", "ร้านขนมโบราณบางลำพู", "ร้านชาบางลำพู"],
      activities: ["ชิมอาหารพื้นบ้าน", "เรียนทำขนมไทย", "ช้อปปิ้งตลาด"],
      duration: 8,
      price: 800,
      maxParticipants: 15,
      currentParticipants: 12,
      includes: ["ไกด์ท้องถิ่น", "อาหาร 3 มื้อ", "กิจกรรมทำขนม", "ของฝาก"],
      excludes: ["ค่าเดินทางไป-กลับ", "เครื่องดื่มเพิ่มเติม"],
      meetingPoint: {
        address: "หน้าตลาดบางลำพู",
        coordinates: { lat: 13.7573, lng: 100.5028 }
      },
      meetingTime: "09:00",
      qrCode: "QR_CODE_2",
      tags: ["อาหาร", "เต็มวัน", "เรียนรู้"]
    },
    {
      id: 3,
      name: "ทัวร์ธรรมชาติและสันทนาการ",
      description: "ทัวร์ที่พาไปชมธรรมชาติและทำกิจกรรมสันทนาการในสวนสาธารณะ",
      images: ["/api/placeholder/400/250"],
      attractions: ["สวนสาธารณะบางลำพู"],
      restaurants: ["ร้านอาหารริมน้ำบางลำพู"],
      activities: ["เดินชมธรรมชาติ", "ออกกำลังกาย", "ปิกนิก"],
      duration: 6,
      price: 600,
      maxParticipants: 25,
      currentParticipants: 18,
      includes: ["ไกด์ท้องถิ่น", "อาหารกลางวัน", "อุปกรณ์ออกกำลังกาย", "ประกันการเดินทาง"],
      excludes: ["ค่าเดินทางไป-กลับ", "เครื่องดื่มเพิ่มเติม"],
      meetingPoint: {
        address: "หน้าสวนสาธารณะบางลำพู",
        coordinates: { lat: 13.7593, lng: 100.5048 }
      },
      meetingTime: "07:00",
      qrCode: "QR_CODE_3",
      tags: ["ธรรมชาติ", "สันทนาการ", "สุขภาพ"]
    }
  ];

  const handleBookPackage = (packageId: number) => {
    setSelectedPackage(packageId);
    // Navigate to booking page
    window.location.href = `/tourism/packages/${packageId}/book`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/tourism" className="hover:text-green-600">ท่องเที่ยว</Link>
            <span>›</span>
            <span className="text-gray-900">แพ็คเกจทัวร์</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">แพ็คเกจทัวร์บางลำพู</h1>
          <p className="text-gray-600">เลือกแพ็คเกจทัวร์ที่เหมาะกับคุณและจองได้ทันที</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium">
              ทั้งหมด
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              ครึ่งวัน
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              เต็มวัน
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              วัฒนธรรม
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              อาหาร
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {packagesData.map((pkg) => (
            <article key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                    {pkg.duration} ชั่วโมง
                  </span>
                  <span className="text-2xl font-bold text-green-600">฿{pkg.price}</span>
                </div>
                
                <h2 className="text-xl font-semibold mb-3">
                  <Link href={`/tourism/packages/${pkg.id}`} className="hover:text-green-600 transition-colors duration-200">
                    {pkg.name}
                  </Link>
                </h2>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {pkg.description}
                </p>
                
                {/* Attractions & Restaurants */}
                <div className="mb-4">
                  <div className="flex items-start mb-2">
                    <svg className="w-4 h-4 mr-2 mt-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium text-gray-900">สถานที่ท่องเที่ยว:</span>
                      <span className="text-sm text-gray-600 ml-2">{pkg.attractions.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-1 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium text-gray-900">ร้านอาหาร:</span>
                      <span className="text-sm text-gray-600 ml-2">{pkg.restaurants.join(', ')}</span>
                    </div>
                  </div>
                </div>
                
                {/* Meeting Info */}
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    พบกันเวลา {pkg.meetingTime} ที่ {pkg.meetingPoint.address}
                  </div>
                </div>
                
                {/* Participants */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">ผู้เข้าร่วม</span>
                    <span className="text-gray-900">{pkg.currentParticipants}/{pkg.maxParticipants}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(pkg.currentParticipants / pkg.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Includes */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">รวมในแพ็คเกจ</h4>
                  <div className="flex flex-wrap gap-1">
                    {pkg.includes.slice(0, 3).map((item, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        {item}
                      </span>
                    ))}
                    {pkg.includes.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{pkg.includes.length - 3} อื่นๆ
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {pkg.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleBookPackage(pkg.id)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                  >
                    จองทันที
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Custom Tour CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">ไม่พบแพ็คเกจที่ต้องการ?</h2>
            <p className="text-blue-100 mb-6">
              สร้างทัวร์ของคุณเองตามความต้องการ
            </p>
            <Link
              href="/tourism/custom-tour"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              สร้างทัวร์แบบกำหนดเอง
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
