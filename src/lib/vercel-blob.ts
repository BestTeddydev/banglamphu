import { put, del } from '@vercel/blob';

// Upload file to Vercel Blob Storage
export async function uploadToVercelBlob(file: File): Promise<string> {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `uploads/${timestamp}-${randomString}.${fileExtension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    return blob.url;
  } catch (error) {
    console.error('Vercel Blob upload error:', error);
    throw new Error('Failed to upload file to Vercel Blob');
  }
}

// Delete file from Vercel Blob Storage
export async function deleteFromVercelBlob(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error('Vercel Blob delete error:', error);
    throw new Error('Failed to delete file from Vercel Blob');
  }
}
