import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Highlight from '@/models/Highlight';

// GET - ดึงไฮไลท์ที่ใช้งานได้สำหรับหน้าแรก
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '6');
    
    const query: Record<string, any> = {
      isActive: true
    };
    
    if (category) {
      query.category = category;
    }

    // ดึงไฮไลท์ที่ใช้งานได้
    const highlights = await Highlight.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: highlights
    });
  } catch (error) {
    console.error('Error fetching active highlights:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลไฮไลท์' },
      { status: 500 }
    );
  }
}
