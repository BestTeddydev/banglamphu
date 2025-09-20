'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Research {
  _id: string;
  title: string;
  description?: string;
  authors?: string[];
  abstract?: string;
  keywords?: string[];
  pdfFile: string;
  category?: string;
  year?: number;
  publishedAt: string;
}

export default function ResearchSection() {
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      const response = await fetch('/api/research?limit=6');
      const data = await response.json();
      if (data.success) {
        setResearch(data.data);
      }
    } catch (error) {
      console.error('Error fetching research:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังโหลดผลงานวิจัย...</p>
          </div>
        </div>
      </section>
    );
  }

  if (research.length === 0) {
    return null; // ไม่แสดงส่วนผลงานวิจัยถ้าไม่มีผลงานวิจัย
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ผลงานวิจัย
          </h2>
          <p className="text-lg text-gray-600">
            เอกสารวิชาการและผลงานวิจัยเกี่ยวกับชุมชนบางลำพู
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {research.map((researchItem) => (
            <div key={researchItem._id} className="bg-gray-50 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  {researchItem.category && (
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {researchItem.category}
                    </span>
                  )}
                  {researchItem.year && (
                    <span className="text-xs text-gray-500">
                      {researchItem.year}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {researchItem.title}
                </h3>

                {researchItem.authors && researchItem.authors.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">ผู้วิจัย:</span> {researchItem.authors.join(', ')}
                    </p>
                  </div>
                )}

                {researchItem.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {researchItem.description}
                  </p>
                )}

                {researchItem.keywords && researchItem.keywords.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {researchItem.keywords.slice(0, 3).map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                      {researchItem.keywords.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{researchItem.keywords.length - 3} อื่นๆ
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(researchItem.publishedAt).toLocaleDateString('th-TH')}
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/research/${researchItem._id}`}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      เปิดอ่าน
                    </Link>

                    <a
                      href={researchItem.pdfFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      ดาวน์โหลด
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/research"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            ดูผลงานวิจัยทั้งหมด
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
