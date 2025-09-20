import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Highlight from '@/models/Highlight';

// GET - ดึงข้อมูลไฮไลท์ตาม ID
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

// PUT - อัปเดตไฮไลท์
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const highlight = await Highlight.findById(params.id);
    
    if (!highlight) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบไฮไลท์' },
        { status: 404 }
      );
    }

    // Validate video URL format if provided
    if (videoUrl) {
      const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com|facebook\.com|instagram\.com|tiktok\.com)/;
      if (!urlPattern.test(videoUrl)) {
        return NextResponse.json(
          { success: false, message: 'กรุณากรอกลิงก์คลิปที่ถูกต้อง (YouTube, Vimeo, Facebook, Instagram, TikTok)' },
          { status: 400 }
        );
      }
    }

    // Update fields
    if (title !== undefined) highlight.title = title;
    if (description !== undefined) highlight.description = description;
    if (thumbnail !== undefined) highlight.thumbnail = thumbnail;
    if (videoUrl !== undefined) highlight.videoUrl = videoUrl;
    if (duration !== undefined) highlight.duration = duration;
    if (category !== undefined) highlight.category = category;
    if (tags !== undefined) highlight.tags = tags;
    if (isActive !== undefined) highlight.isActive = isActive;
    if (order !== undefined) highlight.order = order;

    await highlight.save();

    return NextResponse.json({
      success: true,
      message: 'อัปเดตไฮไลท์สำเร็จ',
      data: highlight
    });
  } catch (error) {
    console.error('Error updating highlight:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตไฮไลท์' },
      { status: 500 }
    );
  }
}

// DELETE - ลบไฮไลท์
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const highlight = await Highlight.findByIdAndDelete(params.id);
    
    if (!highlight) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบไฮไลท์' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบไฮไลท์สำเร็จ'
    });
  } catch (error) {
    console.error('Error deleting highlight:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบไฮไลท์' },
      { status: 500 }
    );
  }
}
