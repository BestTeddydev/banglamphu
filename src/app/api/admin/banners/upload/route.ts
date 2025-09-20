import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ token' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบไฟล์' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'ประเภทไฟล์ไม่ถูกต้อง กรุณาอัปโหลดไฟล์รูปภาพ (JPG, PNG, WebP)' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'ขนาดไฟล์ใหญ่เกินไป กรุณาอัปโหลดไฟล์ขนาดไม่เกิน 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `banner-${timestamp}.${fileExtension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({
      success: true,
      message: 'อัปโหลดรูปภาพสำเร็จ',
      data: {
        url: blob.url,
        filename: filename
      }
    });
  } catch (error) {
    console.error('Error uploading banner image:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ' },
      { status: 500 }
    );
  }
}
