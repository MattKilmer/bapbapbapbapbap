import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
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

    return NextResponse.json({
      url: blob.url,
      filename: file.name
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}