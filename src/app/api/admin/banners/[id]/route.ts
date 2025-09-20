import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { verifyAdminToken } from '@/lib/auth';

// GET - ดึงข้อมูลแบนเนอร์ตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const banner = await Banner.findById(params.id);
    
    if (!banner) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบแบนเนอร์' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแบนเนอร์' },
      { status: 500 }
    );
  }
}

// PUT - อัปเดตแบนเนอร์
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const banner = await Banner.findById(params.id);
    
    if (!banner) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบแบนเนอร์' },
        { status: 404 }
      );
    }

    // Update fields
    if (title !== undefined) banner.title = title;
    if (description !== undefined) banner.description = description;
    if (image !== undefined) banner.image = image;
    if (link !== undefined) banner.link = link;
    if (isActive !== undefined) banner.isActive = isActive;
    if (order !== undefined) banner.order = order;
    if (startDate !== undefined) banner.startDate = startDate ? new Date(startDate) : undefined;
    if (endDate !== undefined) banner.endDate = endDate ? new Date(endDate) : undefined;

    await banner.save();

    return NextResponse.json({
      success: true,
      message: 'อัปเดตแบนเนอร์สำเร็จ',
      data: banner
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตแบนเนอร์' },
      { status: 500 }
    );
  }
}

// DELETE - ลบแบนเนอร์
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ token' },
        { status: 401 }
      );
    }



    await connectDB();

    const banner = await Banner.findByIdAndDelete(params.id);
    
    if (!banner) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบแบนเนอร์' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบแบนเนอร์สำเร็จ'
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบแบนเนอร์' },
      { status: 500 }
    );
  }
}
