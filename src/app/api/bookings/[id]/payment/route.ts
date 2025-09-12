import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export const POST = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const paymentMethod = formData.get('paymentMethod') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // ตรวจสอบการจอง
    const booking = await Booking.findById(params.id);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // สร้างโฟลเดอร์สำหรับสลิป
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'payment-slips');
    await mkdir(uploadDir, { recursive: true });
    
    // สร้างชื่อไฟล์
    const timestamp = Date.now();
    const filename = `payment-${params.id}-${timestamp}.${file.name.split('.').pop()}`;
    const filepath = join(uploadDir, filename);
    
    // บันทึกไฟล์
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);
    
    // อัพเดทการจอง
    const updatedBooking = await Booking.findByIdAndUpdate(
      params.id,
      {
        paymentSlip: `/uploads/payment-slips/${filename}`,
        paymentMethod: paymentMethod || 'bank_transfer',
        paymentStatus: 'pending'
      },
      { new: true }
    ).populate('packageId', 'name price images category')
     .populate('userId', 'name email');
    
    return NextResponse.json({
      message: 'Payment slip uploaded successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Upload payment slip error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
