import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Souvenir from '@/models/Souvenir';

// GET - ดึงรายละเอียดสินค้าที่ระลึกตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const souvenir = await Souvenir.findById(params.id);
    
    if (!souvenir) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบสินค้าที่ระลึก' },
        { status: 404 }
      );
    }

    // ตรวจสอบว่าสินค้าที่ระลึกใช้งานได้หรือไม่
    if (!souvenir.isActive) {
      return NextResponse.json(
        { success: false, message: 'สินค้าที่ระลึกนี้ไม่พร้อมใช้งาน' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: souvenir
    });
  } catch (error) {
    console.error('Error fetching souvenir:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้าที่ระลึก' },
      { status: 500 }
    );
  }
}
