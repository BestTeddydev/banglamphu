import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบไฟล์' },
        { status: 400 }
      );
    }

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB per file
    const maxFiles = 10; // Maximum 10 files

    if (files.length > maxFiles) {
      return NextResponse.json(
        { success: false, message: `สามารถอัปโหลดได้สูงสุด ${maxFiles} ไฟล์` },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, message: 'กรุณาอัปโหลดไฟล์รูปภาพ (JPG, PNG, WebP) เท่านั้น' },
          { status: 400 }
        );
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, message: 'ขนาดไฟล์ใหญ่เกินไป กรุณาอัปโหลดไฟล์ขนาดไม่เกิน 5MB ต่อไฟล์' },
          { status: 400 }
        );
      }
    }

    // Upload all files
    const uploadPromises = files.map(async (file, index) => {
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const filename = `souvenir-${timestamp}-${index}.${fileExtension}`;

      const blob = await put(filename, file, {
        access: 'public',
      });

      return {
        url: blob.url,
        filename: filename
      };
    });

    const uploadResults = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      message: `อัปโหลดรูปภาพสำเร็จ ${uploadResults.length} ไฟล์`,
      data: uploadResults
    });
  } catch (error) {
    console.error('Error uploading souvenir images:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ' },
      { status: 500 }
    );
  }
}
