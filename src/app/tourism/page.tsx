import Link from 'next/link';

export default function TourismPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ท่องเที่ยวบางลำพู
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100">
            สำรวจแหล่งท่องเที่ยวและร้านอาหารในชุมชนบางลำพู
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tourism/attractions"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              แหล่งท่องเที่ยว
            </Link>
            <Link
              href="/tourism/restaurants"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200"
            >
              ร้านอาหาร
            </Link>
            <Link
              href="/tourism/packages"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200"
            >
              แพ็คเกจทัวร์
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            เลือกสิ่งที่คุณสนใจ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/tourism/attractions" className="group">
              <div className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 group-hover:bg-blue-50">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">แหล่งท่องเที่ยว</h3>
                <p className="text-gray-600">
                  สำรวจสถานที่ท่องเที่ยวที่น่าสนใจในชุมชนบางลำพู
                </p>
              </div>
            </Link>
            
            <Link href="/tourism/restaurants" className="group">
              <div className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 group-hover:bg-green-50">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">ร้านอาหาร</h3>
                <p className="text-gray-600">
                  ชิมอาหารท้องถิ่นและอาหารพื้นบ้านที่อร่อย
                </p>
              </div>
            </Link>
            
            <Link href="/tourism/packages" className="group">
              <div className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 group-hover:bg-purple-50">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">แพ็คเกจทัวร์</h3>
                <p className="text-gray-600">
                  เลือกแพ็คเกจทัวร์ที่เหมาะกับคุณ
                </p>
              </div>
            </Link>
            
            <Link href="/tourism/custom-tour" className="group">
              <div className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 group-hover:bg-orange-50">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">ทัวร์แบบกำหนดเอง</h3>
                <p className="text-gray-600">
                  สร้างทัวร์ของคุณเองตามความต้องการ
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Attractions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">แหล่งท่องเที่ยวแนะนำ</h2>
            <Link
              href="/tourism/attractions"
              className="text-green-600 hover:text-green-800 font-semibold"
            >
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample attraction cards */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
              <div className="p-6">
                <span className="text-sm text-blue-600 font-semibold">วัด</span>
                <h3 className="text-lg font-semibold mt-2 mb-2">วัดบางลำพู</h3>
                <p className="text-gray-600 text-sm mb-4">
                  วัดเก่าแก่ที่มีประวัติศาสตร์ยาวนานและสถาปัตยกรรมที่สวยงาม
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>เปิด 06:00 - 18:00</span>
                  <span>อ่านต่อ →</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500"></div>
              <div className="p-6">
                <span className="text-sm text-green-600 font-semibold">ตลาด</span>
                <h3 className="text-lg font-semibold mt-2 mb-2">ตลาดบางลำพู</h3>
                <p className="text-gray-600 text-sm mb-4">
                  ตลาดท้องถิ่นที่เต็มไปด้วยอาหารพื้นบ้านและสินค้าท้องถิ่น
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>เปิด 05:00 - 12:00</span>
                  <span>อ่านต่อ →</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-500"></div>
              <div className="p-6">
                <span className="text-sm text-purple-600 font-semibold">พิพิธภัณฑ์</span>
                <h3 className="text-lg font-semibold mt-2 mb-2">พิพิธภัณฑ์ชุมชนบางลำพู</h3>
                <p className="text-gray-600 text-sm mb-4">
                  พิพิธภัณฑ์ที่บอกเล่าเรื่องราวและประวัติศาสตร์ของชุมชน
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>เปิด 09:00 - 17:00</span>
                  <span>อ่านต่อ →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">ร้านอาหารแนะนำ</h2>
            <Link
              href="/tourism/restaurants"
              className="text-green-600 hover:text-green-800 font-semibold"
            >
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample restaurant cards */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-r from-orange-400 to-red-500"></div>
              <div className="p-6">
                <span className="text-sm text-orange-600 font-semibold">อาหารไทย</span>
                <h3 className="text-lg font-semibold mt-2 mb-2">ร้านอาหารบ้านบางลำพู</h3>
                <p className="text-gray-600 text-sm mb-4">
                  ร้านอาหารพื้นบ้านที่เสิร์ฟอาหารไทยแท้ๆ รสชาติดั้งเดิม
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>เปิด 10:00 - 22:00</span>
                  <span>อ่านต่อ →</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
              <div className="p-6">
                <span className="text-sm text-yellow-600 font-semibold">ของหวาน</span>
                <h3 className="text-lg font-semibold mt-2 mb-2">ร้านขนมโบราณบางลำพู</h3>
                <p className="text-gray-600 text-sm mb-4">
                  ร้านขนมโบราณที่ทำขนมไทยแบบดั้งเดิมด้วยมือ
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>เปิด 08:00 - 18:00</span>
                  <span>อ่านต่อ →</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-r from-green-400 to-teal-500"></div>
              <div className="p-6">
                <span className="text-sm text-green-600 font-semibold">เครื่องดื่ม</span>
                <h3 className="text-lg font-semibold mt-2 mb-2">ร้านชาบางลำพู</h3>
                <p className="text-gray-600 text-sm mb-4">
                  ร้านชาที่เสิร์ฟชาไทยและเครื่องดื่มพื้นบ้าน
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>เปิด 07:00 - 20:00</span>
                  <span>อ่านต่อ →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
