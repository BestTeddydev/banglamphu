"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import BannerCarousel from '@/components/BannerCarousel';
import NewsSection from '@/components/NewsSection';
import ResearchSection from '@/components/ResearchSection';
import SouvenirSection from '@/components/SouvenirSection';
import HighlightSection from '@/components/HighlightSection';
import SponsorSlider from '@/components/SponsorSlider';

export default function Home() {
  const [showBannerModal, setShowBannerModal] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่าเคยปิด modal แล้วหรือยัง
    const bannerClosed = localStorage.getItem('bannerModalClosed');
    if (!bannerClosed) {
      setShowBannerModal(true);
    }

    // เพิ่ม event listener สำหรับปุ่ม ESC
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showBannerModal) {
        closeBannerModal();
      }
    };

    if (showBannerModal) {
      document.addEventListener('keydown', handleEscape);
      // ป้องกันการ scroll ของ body เมื่อ modal เปิด
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showBannerModal]);

  const closeBannerModal = () => {
    setShowBannerModal(false);
    localStorage.setItem('bannerModalClosed', 'true');
  };

  const openBannerModal = () => {
    setShowBannerModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">

      {/* Hero Section - แนะนำชุมชนบางลำพู */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - Optimized */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/anime.jpg)',
            // willChange: 'transform',
          }}
        ></div>

        {/* Background Overlay - Simplified */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 to-green-900/50"></div>

        {/* Background Pattern - Reduced */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-48 h-48 bg-gradient-to-br from-emerald-200/20 to-green-200/20 rounded-full opacity-15"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-tl from-green-200/20 to-emerald-200/20 rounded-full opacity-15"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-8 shadow-lg">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
            <span className="bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
              ชุมชนบางลำพู
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-white mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            เปิดประตูสู่ชุมชนที่มีประวัติศาสตร์ยาวนาน วัฒนธรรมงดงาม และวิถีชีวิตที่น่าสนใจ
            <br />
            <span className="text-xl md:text-2xl text-emerald-200 font-semibold">
              ในเขตพระนคร กรุงเทพมหานคร
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="#highlights"
              className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-xl rounded-3xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              เริ่มต้นการเดินทาง
            </Link>

            <Link
              href="#community-history"
              className="inline-flex items-center px-12 py-6 bg-white text-emerald-600 font-bold text-xl rounded-3xl border-2 border-emerald-500 hover:bg-emerald-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              เรียนรู้ประวัติศาสตร์
            </Link>
          </div>

          {/* Statistics */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-300 mb-2 drop-shadow-lg">200+</div>
              <div className="text-lg text-white font-medium drop-shadow-md">ปีประวัติศาสตร์</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-300 mb-2 drop-shadow-lg">50+</div>
              <div className="text-lg text-white font-medium drop-shadow-md">เรื่องเล่า</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-teal-300 mb-2 drop-shadow-lg">1000+</div>
              <div className="text-lg text-white font-medium drop-shadow-md">ผู้เยี่ยมชม</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-emerald-300 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Banner Modal */}
      {showBannerModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeBannerModal}
        >
          <div
            className="relative max-w-4xl w-full mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeBannerModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Banner Content */}
            <div className="relative">
              <BannerCarousel />
            </div>

            {/* Modal Footer */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-t border-emerald-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  💡 คุณสามารถปิดแบนเนอร์นี้ได้โดยคลิกปุ่ม X
                </p>
                <button
                  onClick={closeBannerModal}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  ปิดแบนเนอร์
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Highlight Section - คลิปไฮไลท์ */}
      <section id="highlights" className="py-24 bg-white relative">
        {/* Background Pattern - Simplified */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-100 to-green-100"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-8 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              คลิปไฮไลท์
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              ชมความงามและเรื่องราวที่น่าสนใจของชุมชนบางลำพูผ่านคลิปวิดีโอ
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 md:p-12 shadow-xl">
            <HighlightSection />
          </div>
        </div>
      </section>

      {/* 3. Community History Section - ประวัติชุมชน */}
      <section id="community-history" className="py-24 bg-gradient-to-br from-emerald-50 to-green-50 relative">
        {/* Background Pattern - Simplified */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-200 to-green-200 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-green-200 to-emerald-200 rounded-full translate-y-28 -translate-x-28"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-8 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              ประวัติชุมชนบางลำพู
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              เรียนรู้เรื่องราวและวัฒนธรรมอันงดงามของชุมชนบางลำพูที่เต็มไปด้วยประวัติศาสตร์และวิถีชีวิตที่น่าสนใจ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">เรื่องเล่าประวัติศาสตร์</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">เรียนรู้ประวัติศาสตร์และวัฒนธรรมของชุมชนบางลำพูที่สืบทอดมาหลายชั่วอายุคน</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">วิถีชีวิตชุมชน</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">สัมผัสวิถีชีวิตและวัฒนธรรมท้องถิ่นที่ยังคงรักษาไว้อย่างงดงาม</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">กิจกรรมและข่าวสาร</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">ติดตามกิจกรรมและข่าวสารล่าสุดของชุมชนบางลำพู</p>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/tourism/stories"
                  className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  เรียนรู้ประวัติชุมชน
                  <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-10 shadow-lg border border-emerald-100">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">ชุมชนบางลำพู</h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">ชุมชนที่มีประวัติศาสตร์ยาวนานและวัฒนธรรมที่งดงาม ตั้งอยู่ในเขตพระนคร กรุงเทพมหานคร</p>
                  <div className="flex justify-center space-x-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-600 mb-2">200+</div>
                      <div className="text-base text-gray-600 font-medium">ปีประวัติศาสตร์</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
                      <div className="text-base text-gray-600 font-medium">เรื่องเล่า</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Attractions Section - แหล่งท่องเที่ยว */}
      <section id="attractions" className="py-24 bg-white relative">
        {/* Background Pattern - Simplified */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-100 to-green-100"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-8 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              แหล่งท่องเที่ยวในชุมชนบางลำพู
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              สำรวจสถานที่ท่องเที่ยวที่น่าสนใจและมีคุณค่าทางประวัติศาสตร์ในชุมชนบางลำพู
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="bg-white rounded-3xl p-10 shadow-lg border border-emerald-100">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">สถานที่ท่องเที่ยวในชุมชนบางลำพู</h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">ค้นพบสถานที่ท่องเที่ยวที่น่าสนใจและมีคุณค่าทางประวัติศาสตร์ในชุมชนบางลำพู</p>
                  <div className="flex justify-center space-x-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-600 mb-2">20+</div>
                      <div className="text-base text-gray-600 font-medium">สถานที่</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                      <div className="text-base text-gray-600 font-medium">ผู้เยี่ยมชม</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">สถานที่สำคัญ</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">วัดวาอารามและสถานที่สำคัญทางประวัติศาสตร์</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">ร้านอาหาร</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">ร้านอาหารอร่อยและอาหารพื้นบ้านในชุมชน</p>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/tourism/attractions"
                  className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  สำรวจแหล่งท่องเที่ยว
                  <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Tour Packages Section - แพ็คเกจทัวร์ */}
      <section id="tour-packages" className="py-24 bg-gradient-to-br from-emerald-50 to-green-50 relative">
        {/* Background Pattern - Simplified */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-200 to-green-200 rounded-full -translate-y-32 -translate-x-32"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tl from-green-200 to-emerald-200 rounded-full translate-y-28 translate-x-28"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-8 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              แพ็คเกจทัวร์ชุมชนบางลำพู
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              เลือกโปรแกรมทัวร์ที่จัดไว้ให้สำหรับการเที่ยวชมชุมชนบางลำพูอย่างครบครัน
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">โปรแกรมทัวร์สำเร็จรูป</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">เลือกโปรแกรมทัวร์ที่จัดไว้ให้สำหรับการเที่ยวชมชุมชนบางลำพู</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">ปรับแต่งโปรแกรมท่องเที่ยว</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">สร้างโปรแกรมท่องเที่ยวชุมชนบางลำพูของคุณเองตามความต้องการ</p>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/tourism/packages"
                  className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  ดูแพ็คเกจทัวร์
                  <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/tourism/custom-tour"
                  className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  สร้างโปรแกรมเอง
                  <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-10 shadow-lg border border-emerald-100">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">แพ็คเกจทัวร์ชุมชนบางลำพู</h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">เลือกโปรแกรมทัวร์ที่เหมาะสมกับความต้องการของคุณสำหรับการเที่ยวชมชุมชนบางลำพู</p>
                  <div className="flex justify-center space-x-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-600 mb-2">10+</div>
                      <div className="text-base text-gray-600 font-medium">แพ็คเกจ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">200+</div>
                      <div className="text-base text-gray-600 font-medium">ผู้เข้าร่วม</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Sponsor Section - สปอนเซอร์ */}
      <section id="sponsors">
        <SponsorSlider />
      </section>

      {/* Additional Sections */}
      <section className="py-24 bg-white relative">
        {/* Background Pattern - Simplified */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-100 to-green-100"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-8 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              ข้อมูลเพิ่มเติม
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              ข่าวสาร ผลงานวิจัย สินค้าที่ระลึก และข้อมูลที่น่าสนใจอื่นๆ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* News Section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-emerald-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">ข่าวสาร</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">ติดตามข่าวสารและกิจกรรมล่าสุด</p>
                <NewsSection />
              </div>
            </div>

            {/* Research Section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-emerald-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">ผลงานวิจัย</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">ผลงานวิจัยและงานวิชาการ</p>
                <ResearchSection />
              </div>
            </div>

            {/* Souvenir Section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-emerald-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">สินค้าที่ระลึก</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">สินค้าที่ระลึกและของฝาก</p>
                <SouvenirSection />
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-emerald-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">ติดต่อเรา</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">ติดต่อสอบถามข้อมูลเพิ่มเติม</p>
                <div className="space-y-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl w-full justify-center"
                  >
                    ติดต่อเรา
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <button
                    onClick={openBannerModal}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl w-full justify-center"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    ดูแบนเนอร์
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
}