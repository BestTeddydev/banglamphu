import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-emerald-800 to-green-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">ชุมชนบางลำพู</h3>
            </div>
            <p className="text-emerald-100 mb-4">
              ศูนย์กลางการท่องเที่ยวและวัฒนธรรมแห่งกรุงเทพมหานคร
            </p>
            <p className="text-sm text-emerald-200">
              © 2024 ชุมชนบางลำพู. สงวนลิขสิทธิ์.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-emerald-100">เมนูหลัก</h4>
            <ul className="space-y-2">
              <li><Link href="/tourism/attractions" className="text-emerald-200 hover:text-white transition-colors">แหล่งท่องเที่ยว</Link></li>
              <li><Link href="/tourism/restaurants" className="text-emerald-200 hover:text-white transition-colors">ร้านอาหาร</Link></li>
              <li><Link href="/tourism/packages" className="text-emerald-200 hover:text-white transition-colors">โปรแกรมทัวร์</Link></li>
              <li><Link href="/tourism/custom-tour" className="text-emerald-200 hover:text-white transition-colors">ปรับแต่งโปรแกรมท่องเที่ยว</Link></li>
              <li><Link href="/tourism/stories" className="text-emerald-200 hover:text-white transition-colors">ประวัติศาสตร์</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-emerald-100">ติดต่อเรา</h4>
            <div className="space-y-2 text-emerald-200">
              <p>📧 info@banglamphu.com</p>
              <p>📞 02-123-4567</p>
              <p>📍 กรุงเทพมหานคร ประเทศไทย</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
