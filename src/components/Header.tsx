'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  const navigation = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'ประวัติชุมชน', href: '/tourism/stories' },
    { name: 'ท่องเที่ยว', href: '/tourism/attractions' },
    { name: 'ร้านอาหาร', href: '/tourism/restaurants' },
    { name: 'สินค้าที่ระลึก', href: '/souvenirs' },
    { name: 'แพ็คเกจทัวร์', href: '/tourism/packages' },
    { name: 'ปรับแต่งแพ็คเกจทัวร์', href: '/tourism/custom-tour' },
    { name: 'ข่าวสาร และ งานวิจัย', href: '/research' },
  ];

  return (
    <header className="bg-gradient-to-br from-emerald-800 to-green-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Image
                  src="/logo.jpeg"
                  alt="โลโก้ชุมชนบางลำพู"
                  width={80}
                  height={80}
                  className="rounded-lg"
                  priority
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ชุมชนบางลำพู</h1>
                <p className="text-sm text-emerald-200">Banglamphu Community</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-emerald-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                  >
                    ระบบจัดการ
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-white">สวัสดี, {user.name}</span>
                  <button
                    onClick={logout}
                    className="text-white hover:text-red-300 text-sm font-medium transition-colors duration-200"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-emerald-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-br from-emerald-400 to-green-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:from-emerald-500 hover:to-green-600 transition-colors duration-200"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-emerald-200 hover:text-white focus:outline-none focus:text-green-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/10 backdrop-blur-sm rounded-lg mb-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-emerald-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile User Menu */}
              <div className="border-t border-white/20 pt-3 mt-3">
                {user ? (
                  <div className="space-y-2">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="bg-red-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-700 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        ระบบจัดการ
                      </Link>
                    )}
                    <div className="px-3 py-2 text-sm text-white">
                      สวัสดี, {user.name}
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="text-white hover:text-red-300 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      เข้าสู่ระบบ
                    </Link>
                    <Link
                      href="/register"
                      className="bg-gradient-to-br from-emerald-400 to-green-500 text-white block px-3 py-2 rounded-md text-base font-medium hover:from-emerald-500 hover:to-green-600 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      สมัครสมาชิก
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
