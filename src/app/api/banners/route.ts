import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Banner from '@/models/Banner';

// GET - ดึงแบนเนอร์ที่ใช้งานได้สำหรับหน้าแรก
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const now = new Date();
    
    // ดึงแบนเนอร์ที่ใช้งานได้และอยู่ในช่วงเวลาที่กำหนด
    const banners = await Banner.find({
      isActive: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ],
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    })
    .sort({ order: 1, createdAt: -1 })
    .limit(10); // จำกัดจำนวนแบนเนอร์ที่แสดง

    return NextResponse.json({
      success: true,
      data: banners
    });
  } catch (error) {
    console.error('Error fetching active banners:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแบนเนอร์' },
      { status: 500 }
    );
  }
}
