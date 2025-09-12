import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Banner Section */}
      <section className="relative">
        <div className="relative h-96 overflow-hidden">
          <Image
            src="/banner.jpg"
            alt="แบนเนอร์ชุมชนบางลำพู"
            fill
            className="object-cover"
            priority
          />
      
        </div>
      </section>

      {/* Main Menu Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            เมนูหลัก
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* แหล่งท่องเที่ยว */}
            <Link href="/tourism/attractions" className="group">
              <div className="text-center p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">แหล่งท่องเที่ยว</h3>
                <p className="text-gray-600 mb-6">
                  สำรวจสถานที่ท่องเที่ยวที่น่าสนใจในชุมชนบางลำพู
                </p>
                <div className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-800">
                  เริ่มสำรวจ
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* ร้านอาหาร */}
            <Link href="/tourism/restaurants" className="group">
              <div className="text-center p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 group-hover:from-green-100 group-hover:to-green-200">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">ร้านอาหาร</h3>
                <p className="text-gray-600 mb-6">
                  ค้นหาร้านอาหารอร่อยและอาหารพื้นบ้านในชุมชน
                </p>
                <div className="inline-flex items-center text-green-600 font-semibold group-hover:text-green-800">
                  ดูร้านอาหาร
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* โปรแกรมทัวร์ */}
            <Link href="/tourism/packages" className="group">
              <div className="text-center p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 group-hover:from-purple-100 group-hover:to-purple-200">
                <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">โปรแกรมทัวร์</h3>
                <p className="text-gray-600 mb-6">
                  เลือกโปรแกรมทัวร์ที่จัดไว้ให้สำหรับการเที่ยวชมชุมชน
                </p>
                <div className="inline-flex items-center text-purple-600 font-semibold group-hover:text-purple-800">
                  ดูโปรแกรมทัวร์
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* ปรับแต่งโปรแกรมท่องเที่ยว */}
            <Link href="/tourism/custom-tour" className="group">
              <div className="text-center p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100 group-hover:from-orange-100 group-hover:to-orange-200">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">ปรับแต่งโปรแกรมท่องเที่ยว</h3>
                <p className="text-gray-600 mb-6">
                  สร้างโปรแกรมท่องเที่ยวของคุณเองตามความต้องการ
                </p>
                <div className="inline-flex items-center text-orange-600 font-semibold group-hover:text-orange-800">
                  เริ่มสร้าง
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* นิทาน */}
            <Link href="/tourism/stories" className="group">
              <div className="text-center p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-pink-50 to-pink-100 group-hover:from-pink-100 group-hover:to-pink-200">
                <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">ข่าวสาร และ กิจกรรม</h3>
                <p className="text-gray-600 mb-6">
                  อ่านนิทานและเรื่องเล่าประวัติศาสตร์ของชุมชนบางลำพู
                </p>
                <div className="inline-flex items-center text-pink-600 font-semibold group-hover:text-pink-800">
                  อ่านนิทาน
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

           
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Image
                  src="/logo.jpeg"
                  alt="โลโก้ชุมชนบางลำพู"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <h3 className="text-xl font-bold ml-3">ชุมชนบางลำพู</h3>
              </div>
              <p className="text-gray-400 mb-4">
                ศูนย์กลางการท่องเที่ยวและวัฒนธรรมแห่งกรุงเทพมหานคร
              </p>
              <p className="text-sm text-gray-500">
                © 2024 ชุมชนบางลำพู. สงวนลิขสิทธิ์.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">เมนูหลัก</h4>
              <ul className="space-y-2">
                <li><Link href="/tourism/attractions" className="text-gray-400 hover:text-white transition-colors">แหล่งท่องเที่ยว</Link></li>
                <li><Link href="/tourism/restaurants" className="text-gray-400 hover:text-white transition-colors">ร้านอาหาร</Link></li>
                <li><Link href="/tourism/packages" className="text-gray-400 hover:text-white transition-colors">โปรแกรมทัวร์</Link></li>
                <li><Link href="/tourism/custom-tour" className="text-gray-400 hover:text-white transition-colors">ปรับแต่งโปรแกรมท่องเที่ยว</Link></li>
                <li><Link href="/tourism/stories" className="text-gray-400 hover:text-white transition-colors">นิทาน</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">ติดต่อเรา</h4>
              <div className="space-y-2 text-gray-400">
                <p>📧 info@banglamphu.com</p>
                <p>📞 02-123-4567</p>
                <p>📍 กรุงเทพมหานคร ประเทศไทย</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
