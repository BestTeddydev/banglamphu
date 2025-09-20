import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Research from '@/models/Research';

// GET - ดึงข้อมูลผลงานวิจัยตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const research = await Research.findOne({
      _id: params.id,
      isActive: true
    });
    
    if (!research) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบผลงานวิจัย' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: research
    });
  } catch (error) {
    console.error('Error fetching research:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผลงานวิจัย' },
      { status: 500 }
    );
  }
}
