import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบไฟล์' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'กรุณาอัปโหลดไฟล์รูปภาพ (JPG, PNG, WebP) เท่านั้น' },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'ขนาดไฟล์ใหญ่เกินไป กรุณาอัปโหลดไฟล์ขนาดไม่เกิน 5MB' },
        { status: 400 }
      );
    }

    // Upload file
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `highlight-thumbnail-${timestamp}.${fileExtension}`;

    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({
      success: true,
      message: 'อัปโหลดรูปหน้าปกคลิปสำเร็จ',
      data: {
        url: blob.url,
        filename: filename
      }
    });
  } catch (error) {
    console.error('Error uploading highlight thumbnail:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปโหลดรูปหน้าปกคลิป' },
      { status: 500 }
    );
  }
}
