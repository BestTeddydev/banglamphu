import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import News from '@/models/News';

// GET - ดึงข้อมูลข่าวสารตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const news = await News.findById(params.id);
    
    if (!news) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข่าวสาร' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลข่าวสาร' },
      { status: 500 }
    );
  }
}

// PUT - อัปเดตข่าวสาร
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, description, link, source, category, isActive, order, publishedAt } = body;

    const news = await News.findById(params.id);
    
    if (!news) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข่าวสาร' },
        { status: 404 }
      );
    }

    // Validate URL format if link is provided
    if (link) {
      try {
        new URL(link);
      } catch {
        return NextResponse.json(
          { success: false, message: 'รูปแบบลิงก์ไม่ถูกต้อง' },
          { status: 400 }
        );
      }
    }

    // Update fields
    if (title !== undefined) news.title = title;
    if (description !== undefined) news.description = description;
    if (link !== undefined) news.link = link;
    if (source !== undefined) news.source = source;
    if (category !== undefined) news.category = category;
    if (isActive !== undefined) news.isActive = isActive;
    if (order !== undefined) news.order = order;
    if (publishedAt !== undefined) news.publishedAt = publishedAt ? new Date(publishedAt) : new Date();

    await news.save();

    return NextResponse.json({
      success: true,
      message: 'อัปเดตข่าวสารสำเร็จ',
      data: news
    });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตข่าวสาร' },
      { status: 500 }
    );
  }
}

// DELETE - ลบข่าวสาร
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const news = await News.findByIdAndDelete(params.id);
    
    if (!news) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข่าวสาร' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบข่าวสารสำเร็จ'
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบข่าวสาร' },
      { status: 500 }
    );
  }
}
