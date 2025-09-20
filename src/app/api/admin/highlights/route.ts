import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Highlight from '@/models/Highlight';

// GET - ดึงรายการไฮไลท์ทั้งหมด
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

    const highlights = await Highlight.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Highlight.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: highlights,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching highlights:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลไฮไลท์' },
      { status: 500 }
    );
  }
}

// POST - สร้างไฮไลท์ใหม่
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      title, 
      description, 
      thumbnail, 
      videoUrl, 
      duration, 
      category, 
      tags, 
      isActive, 
      order 
    } = body;

    // Validate required fields
    if (!title || !thumbnail || !videoUrl) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกชื่อคลิป แนบรูปหน้าปก และลิงก์คลิป' },
        { status: 400 }
      );
    }

    // Validate video URL format
    const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com|facebook\.com|instagram\.com|tiktok\.com)/;
    if (!urlPattern.test(videoUrl)) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกลิงก์คลิปที่ถูกต้อง (YouTube, Vimeo, Facebook, Instagram, TikTok)' },
        { status: 400 }
      );
    }

    const highlight = new Highlight({
      title,
      description,
      thumbnail,
      videoUrl,
      duration,
      category,
      tags: tags || [],
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    await highlight.save();

    return NextResponse.json({
      success: true,
      message: 'สร้างไฮไลท์สำเร็จ',
      data: highlight
    });
  } catch (error) {
    console.error('Error creating highlight:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้างไฮไลท์' },
      { status: 500 }
    );
  }
}
