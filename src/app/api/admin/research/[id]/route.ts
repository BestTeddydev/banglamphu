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
    
    const research = await Research.findById(params.id);
    
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

// PUT - อัปเดตผลงานวิจัย
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

    const research = await Research.findById(params.id);
    
    if (!research) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบผลงานวิจัย' },
        { status: 404 }
      );
    }

    // Update fields
    if (title !== undefined) research.title = title;
    if (description !== undefined) research.description = description;
    if (authors !== undefined) research.authors = authors;
    if (abstract !== undefined) research.abstract = abstract;
    if (keywords !== undefined) research.keywords = keywords;
    if (pdfFile !== undefined) research.pdfFile = pdfFile;
    if (category !== undefined) research.category = category;
    if (year !== undefined) research.year = year ? parseInt(year) : undefined;
    if (isActive !== undefined) research.isActive = isActive;
    if (order !== undefined) research.order = order;
    if (publishedAt !== undefined) research.publishedAt = publishedAt ? new Date(publishedAt) : new Date();

    await research.save();

    return NextResponse.json({
      success: true,
      message: 'อัปเดตผลงานวิจัยสำเร็จ',
      data: research
    });
  } catch (error) {
    console.error('Error updating research:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตผลงานวิจัย' },
      { status: 500 }
    );
  }
}

// DELETE - ลบผลงานวิจัย
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const research = await Research.findByIdAndDelete(params.id);
    
    if (!research) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบผลงานวิจัย' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบผลงานวิจัยสำเร็จ'
    });
  } catch (error) {
    console.error('Error deleting research:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบผลงานวิจัย' },
      { status: 500 }
    );
  }
}
