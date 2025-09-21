'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Banner {
  _id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  order: number;
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      const data = await response.json();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // เปลี่ยนแบนเนอร์ทุก 5 วินาที

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1);
  };

  if (loading) {
    return (
      <section className="relative">
        <div className="relative h-96 overflow-hidden bg-gray-200 animate-pulse">
          <div className="w-full h-full bg-gray-300"></div>
        </div>
      </section>
    );
  }

  if (banners.length === 0) {
    // แสดงแบนเนอร์เริ่มต้นถ้าไม่มีแบนเนอร์ในระบบ
    return (
      <section className="relative">
        <div className="relative h-96 overflow-hidden">
          <Image
            src="/banner.jpg"
            alt="แบนเนอร์ชุมชนบางลำพู"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      <div className="relative h-96 overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
          >
            {banner.link ? (
              <Link href={banner.link} className="block h-full">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={index === 0}
                />

              </Link>
            ) : (
              <div className="relative h-full">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            )}
          </div>
        ))}

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
              aria-label="Previous banner"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
              aria-label="Next banner"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
