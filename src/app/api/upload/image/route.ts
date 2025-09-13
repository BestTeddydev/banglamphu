import { NextRequest, NextResponse } from 'next/server';
import { uploadToVercelBlob } from '@/lib/vercel-blob';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const imageUrl = await uploadToVercelBlob(file);

    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename: file.name
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Error uploading file' 
    }, { status: 500 });
  }
}