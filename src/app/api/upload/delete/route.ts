import { NextRequest, NextResponse } from 'next/server';
import { deleteFromVercelBlob } from '@/lib/vercel-blob';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json();
    
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ error: 'Invalid URLs provided' }, { status: 400 });
    }

    const deletePromises = urls.map(async (url: string) => {
      try {
        // Delete from Vercel Blob
        await deleteFromVercelBlob(url);
        
        return { url, success: true };
      } catch (error) {
        console.error(`Error deleting file ${url}:`, error);
        return { url, success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });

    const results = await Promise.all(deletePromises);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    return NextResponse.json({
      message: `Deleted ${successful.length} files successfully`,
      successful: successful.length,
      failed: failed.length,
      results
    });
    
  } catch (error) {
    console.error('Error in delete images API:', error);
    return NextResponse.json(
      { error: 'Failed to delete images' },
      { status: 500 }
    );
  }
}