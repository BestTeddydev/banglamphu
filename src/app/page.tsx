import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ยินดีต้อนรับสู่ชุมชนบางลำพู
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            ศูนย์กลางข้อมูลข่าวสาร กิจกรรม และการติดต่อของชุมชน
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/news"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              อ่านข่าวสาร
            </Link>
            <Link
              href="/events"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              ดูกิจกรรม
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            บริการของชุมชน
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">ข่าวสารชุมชน</h3>
              <p className="text-gray-600">
                ติดตามข่าวสารและประกาศต่างๆ ของชุมชนอย่างทันสมัย
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">กิจกรรมชุมชน</h3>
              <p className="text-gray-600">
                เข้าร่วมกิจกรรมต่างๆ ของชุมชนและสร้างความสัมพันธ์ที่ดี
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">ติดต่อชุมชน</h3>
              <p className="text-gray-600">
                ติดต่อสอบถามข้อมูลหรือแจ้งปัญหาต่างๆ ได้อย่างสะดวก
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">ข่าวสารล่าสุด</h2>
            <Link
              href="/news"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample news cards */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
              <div className="p-6">
                <span className="text-sm text-blue-600 font-semibold">ข่าวทั่วไป</span>
                <h3 className="text-lg font-semibold mt-2 mb-2">ประชุมชุมชนประจำเดือน</h3>
                <p className="text-gray-600 text-sm mb-4">
                  การประชุมชุมชนประจำเดือนมกราคม 2567 เพื่อหารือเรื่องการพัฒนาชุมชน
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>15 ม.ค. 2567</span>
                  <span>อ่านต่อ →</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500"></div>
              <div className="p-6">
                <span className="text-sm text-green-600 font-semibold">กิจกรรม</span>
                <h3 className="text-lg font-semibold mt-2 mb-2">งานวันเด็กแห่งชาติ</h3>
                <p className="text-gray-600 text-sm mb-4">
                  กิจกรรมวันเด็กแห่งชาติประจำปี 2567 พร้อมของรางวัลและอาหาร
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>10 ม.ค. 2567</span>
                  <span>อ่านต่อ →</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-500"></div>
              <div className="p-6">
                <span className="text-sm text-purple-600 font-semibold">ประกาศ</span>
                <h3 className="text-lg font-semibold mt-2 mb-2">การปรับปรุงถนนในชุมชน</h3>
                <p className="text-gray-600 text-sm mb-4">
                  แจ้งให้ทราบเรื่องการปรับปรุงถนนในชุมชนบางลำพู
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>5 ม.ค. 2567</span>
                  <span>อ่านต่อ →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">กิจกรรมที่จะมาถึง</h2>
            <Link
              href="/events"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mr-4">
                  20
                </div>
                <div>
                  <h3 className="text-lg font-semibold">งานบุญประจำปี</h3>
                  <p className="text-gray-600">กุมภาพันธ์ 2567</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                งานบุญประจำปีของชุมชนบางลำพู พร้อมกิจกรรมต่างๆ และอาหารพื้นบ้าน
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                วัดบางลำพู
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mr-4">
                  25
                </div>
                <div>
                  <h3 className="text-lg font-semibold">ตลาดนัดชุมชน</h3>
                  <p className="text-gray-600">กุมภาพันธ์ 2567</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                ตลาดนัดชุมชนสำหรับขายสินค้าพื้นบ้านและอาหารท้องถิ่น
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                ลานชุมชนบางลำพู
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
