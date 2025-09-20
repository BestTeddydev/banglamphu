'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PDFViewer from '@/components/PDFViewer';
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

export default function ResearchViewerPage() {
  const params = useParams();
  const [research, setResearch] = useState<Research | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchResearch();
    }
  }, [params.id]);

  const fetchResearch = async () => {
    try {
      const response = await fetch(`/api/research/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setResearch(data.data);
      } else {
        setError(data.message || 'ไม่พบผลงานวิจัย');
      }
    } catch (error) {
      console.error('Error fetching research:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดผลงานวิจัย...</p>
        </div>
      </div>
    );
  }

  if (error || !research) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ไม่พบผลงานวิจัย</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                กลับหน้าแรก
              </Link>

              <div className="w-px h-6 bg-gray-300"></div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">{research.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  {research.category && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {research.category}
                    </span>
                  )}
                  {research.year && <span>{research.year}</span>}
                  {research.authors && research.authors.length > 0 && (
                    <span>โดย {research.authors.join(', ')}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={research.pdfFile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                ดาวน์โหลด PDF
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <PDFViewer pdfUrl={research.pdfFile} title={research.title} />
    </div>
  );
}
