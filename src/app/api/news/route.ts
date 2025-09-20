import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import News from '@/models/News';

// GET - ดึงข่าวสารที่ใช้งานได้สำหรับหน้าแรก
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '5');
    
    const query: Record<string, any> = {
      isActive: true
    };
    
    if (category) {
      query.category = category;
    }

    // ดึงข่าวสารที่ใช้งานได้
    const news = await News.find(query)
      .sort({ order: 1, publishedAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error fetching active news:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลข่าวสาร' },
      { status: 500 }
    );
  }
}