import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Banner from '@/models/Banner';

// GET - ดึงรายการแบนเนอร์ทั้งหมด
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const query: Record<string, boolean> = {};
    
    if (active !== null) {
      query.isActive = active === 'true';
    }

    const banners = await Banner.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Banner.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: banners,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแบนเนอร์' },
      { status: 500 }
    );
  }
}

// POST - สร้างแบนเนอร์ใหม่
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ token' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { title, description, image, link, isActive, order, startDate, endDate } = body;

    // Validate required fields
    if (!title || !image) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลที่จำเป็น' },
        { status: 400 }
      );
    }

    const banner = new Banner({
      title,
      description,
      image,
      link,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    });

    await banner.save();

    return NextResponse.json({
      success: true,
      message: 'สร้างแบนเนอร์สำเร็จ',
      data: banner
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้างแบนเนอร์' },
      { status: 500 }
    );
  }
}
