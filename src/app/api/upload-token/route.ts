import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { uploadRateLimit, addRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await uploadRateLimit(req);
  
  if (!rateLimitResult.success) {
    const response = NextResponse.json(
      { error: rateLimitResult.error },
      { status: 429 }
    );
    return addRateLimitHeaders(response, rateLimitResult);
  }
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Uploading file:', { name: file.name, size: file.size, type: file.type });

    // Upload directly to Vercel Blob
    const blob = await put(`${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    console.log('Upload completed:', { url: blob.url });

    const response = NextResponse.json({
      url: blob.url,
      filename: file.name
    });
    
    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    console.error('Upload error:', error);
    const response = NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    return addRateLimitHeaders(response, rateLimitResult);
  }
}