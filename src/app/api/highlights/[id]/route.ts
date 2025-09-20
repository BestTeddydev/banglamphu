import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Highlight from '@/models/Highlight';

// GET - ดึงรายละเอียดไฮไลท์ตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const highlight = await Highlight.findById(params.id);
    
    if (!highlight) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบไฮไลท์' },
        { status: 404 }
      );
    }

    // ตรวจสอบว่าสินค้าที่ระลึกใช้งานได้หรือไม่
    if (!highlight.isActive) {
      return NextResponse.json(
        { success: false, message: 'ไฮไลท์นี้ไม่พร้อมใช้งาน' },
        { status: 404 }
      );
    }

    // เพิ่มจำนวนผู้ชม
    highlight.viewCount = (highlight.viewCount || 0) + 1;
    await highlight.save();

    return NextResponse.json({
      success: true,
      data: highlight
    });
  } catch (error) {
    console.error('Error fetching highlight:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลไฮไลท์' },
      { status: 500 }
    );
  }
}
