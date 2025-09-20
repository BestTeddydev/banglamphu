import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Research from '@/models/Research';

// GET - ดึงรายการผลงานวิจัยทั้งหมด
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const category = searchParams.get('category');
    const year = searchParams.get('year');
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
    
    if (year) {
      query.year = parseInt(year);
    }

    const research = await Research.find(query)
      .sort({ order: 1, publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Research.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: research,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching research:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผลงานวิจัย' },
      { status: 500 }
    );
  }
}

// POST - สร้างผลงานวิจัยใหม่
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      title, 
      description, 
      authors, 
      abstract, 
      keywords, 
      pdfFile, 
      category, 
      year, 
      isActive, 
      order, 
      publishedAt 
    } = body;

    // Validate required fields
    if (!title || !pdfFile) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกชื่อหัวข้อและแนบไฟล์ PDF' },
        { status: 400 }
      );
    }

    const research = new Research({
      title,
      description,
      authors: authors || [],
      abstract,
      keywords: keywords || [],
      pdfFile,
      category,
      year: year ? parseInt(year) : undefined,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date()
    });

    await research.save();

    return NextResponse.json({
      success: true,
      message: 'สร้างผลงานวิจัยสำเร็จ',
      data: research
    });
  } catch (error) {
    console.error('Error creating research:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้างผลงานวิจัย' },
      { status: 500 }
    );
  }
}
