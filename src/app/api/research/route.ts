import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Research from '@/models/Research';

// GET - ดึงผลงานวิจัยที่ใช้งานได้สำหรับหน้าแรก
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const year = searchParams.get('year');
    const limit = parseInt(searchParams.get('limit') || '6');
    
    const query: Record<string, any> = {
      isActive: true
    };
    
    if (category) {
      query.category = category;
    }
    
    if (year) {
      query.year = parseInt(year);
    }

    // ดึงผลงานวิจัยที่ใช้งานได้
    const research = await Research.find(query)
      .sort({ order: 1, publishedAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: research
    });
  } catch (error) {
    console.error('Error fetching active research:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผลงานวิจัย' },
      { status: 500 }
    );
  }
}
