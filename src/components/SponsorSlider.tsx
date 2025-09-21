'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SponsorSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // รายการโลโก้ผู้สนับสนุน
  const sponsorLogos = [
    '/sponser/1.jpg',
    '/sponser/2.jpg',
    '/sponser/3.jpg',
    '/sponser/5.jpg',
    '/sponser/6.png',
    '/sponser/7.jpg',
    '/sponser/8.png',
    '/sponser/9.png',
    '/sponser/10.png',
    '/sponser/11.jpg',
    '/sponser/12.png',
    '/sponser/13.png',
    '/sponser/14.jpg',
    '/sponser/15.jpg',
    '/sponser/16.png',
    '/sponser/17.png',
    '/sponser/18.png',
    '/sponser/19.jpg',
    '/sponser/20.jpg'
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === sponsorLogos.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // เปลี่ยนทุก 3 วินาที

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === sponsorLogos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sponsorLogos.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">ผู้สนับสนุน</h2>
          <p className="text-gray-600 text-lg">ขอบคุณผู้สนับสนุนที่ให้การสนับสนุนโครงการ</p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Main Image Display */}
          <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg shadow-lg">
            <Image
              src={sponsorLogos[currentIndex]}
              alt={`ผู้สนับสนุน ${currentIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              className="object-contain transition-opacity duration-500"
              priority
            />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="โลโก้ก่อนหน้า"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="โลโก้ถัดไป"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {sponsorLogos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex
                  ? 'bg-green-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                aria-label={`ไปยังโลโก้ ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">โลโก้ผู้สนับสนุนทั้งหมด</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {sponsorLogos.map((logo, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative h-16 w-16 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${index === currentIndex
                  ? 'border-green-600 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <Image
                  src={logo}
                  alt={`ผู้สนับสนุน ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            {currentIndex + 1} / {sponsorLogos.length}
          </p>
        </div>
      </div>
    </div>
  );
}
