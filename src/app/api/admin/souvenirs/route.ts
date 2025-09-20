import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Souvenir from '@/models/Souvenir';

// GET - ดึงรายการสินค้าที่ระลึกทั้งหมด
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

    const souvenirs = await Souvenir.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Souvenir.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: souvenirs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching souvenirs:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้าที่ระลึก' },
      { status: 500 }
    );
  }
}

// POST - สร้างสินค้าที่ระลึกใหม่
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      name, 
      description, 
      images, 
      price, 
      category, 
      material, 
      size, 
      weight, 
      origin, 
      isActive, 
      order 
    } = body;

    // Validate required fields
    if (!name || !images || images.length === 0) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกชื่อสินค้าและแนบรูปภาพอย่างน้อย 1 รูป' },
        { status: 400 }
      );
    }

    const souvenir = new Souvenir({
      name,
      description,
      images,
      price: price ? parseFloat(price) : undefined,
      category,
      material,
      size,
      weight,
      origin,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    await souvenir.save();

    return NextResponse.json({
      success: true,
      message: 'สร้างสินค้าที่ระลึกสำเร็จ',
      data: souvenir
    });
  } catch (error) {
    console.error('Error creating souvenir:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้างสินค้าที่ระลึก' },
      { status: 500 }
    );
  }
}
