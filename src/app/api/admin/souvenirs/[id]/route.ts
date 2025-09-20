import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Souvenir from '@/models/Souvenir';

// GET - ดึงข้อมูลสินค้าที่ระลึกตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const souvenir = await Souvenir.findById(params.id);
    
    if (!souvenir) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบสินค้าที่ระลึก' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: souvenir
    });
  } catch (error) {
    console.error('Error fetching souvenir:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้าที่ระลึก' },
      { status: 500 }
    );
  }
}

// PUT - อัปเดตสินค้าที่ระลึก
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const souvenir = await Souvenir.findById(params.id);
    
    if (!souvenir) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบสินค้าที่ระลึก' },
        { status: 404 }
      );
    }

    // Update fields
    if (name !== undefined) souvenir.name = name;
    if (description !== undefined) souvenir.description = description;
    if (images !== undefined) souvenir.images = images;
    if (price !== undefined) souvenir.price = price ? parseFloat(price) : undefined;
    if (category !== undefined) souvenir.category = category;
    if (material !== undefined) souvenir.material = material;
    if (size !== undefined) souvenir.size = size;
    if (weight !== undefined) souvenir.weight = weight;
    if (origin !== undefined) souvenir.origin = origin;
    if (isActive !== undefined) souvenir.isActive = isActive;
    if (order !== undefined) souvenir.order = order;

    await souvenir.save();

    return NextResponse.json({
      success: true,
      message: 'อัปเดตสินค้าที่ระลึกสำเร็จ',
      data: souvenir
    });
  } catch (error) {
    console.error('Error updating souvenir:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตสินค้าที่ระลึก' },
      { status: 500 }
    );
  }
}

// DELETE - ลบสินค้าที่ระลึก
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const souvenir = await Souvenir.findByIdAndDelete(params.id);
    
    if (!souvenir) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบสินค้าที่ระลึก' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบสินค้าที่ระลึกสำเร็จ'
    });
  } catch (error) {
    console.error('Error deleting souvenir:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบสินค้าที่ระลึก' },
      { status: 500 }
    );
  }
}
