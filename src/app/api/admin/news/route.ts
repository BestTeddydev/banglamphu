import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import News from '@/models/News';

// GET - ดึงรายการข่าวสารทั้งหมด
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    
    if (active !== null) {
      query.isActive = active === 'true';
    }
    
    if (category) {
      query.category = category;
    }

    const news = await News.find(query)
      .sort({ order: 1, publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await News.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: news,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลข่าวสาร' },
      { status: 500 }
    );
  }
}

// POST - สร้างข่าวสารใหม่
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, description, link, source, category, isActive, order, publishedAt } = body;

    // Validate required fields
    if (!title || !link) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกหัวข้อและลิงก์ข่าว' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(link);
    } catch {
      return NextResponse.json(
        { success: false, message: 'รูปแบบลิงก์ไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    const news = new News({
      title,
      description,
      link,
      source,
      category,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date()
    });

    await news.save();

    return NextResponse.json({
      success: true,
      message: 'สร้างข่าวสารสำเร็จ',
      data: news
    });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้างข่าวสาร' },
      { status: 500 }
    );
  }
}
