import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { adminRateLimit, addRateLimitHeaders } from '@/lib/rate-limit';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const samples = await prisma.sample.findMany({
    where: { zoneId: parseInt(id) },
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({ samples });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Apply rate limiting
  const rateLimitResult = await adminRateLimit(req);
  
  if (!rateLimitResult.success) {
    const response = NextResponse.json(
      { error: rateLimitResult.error },
      { status: 429 }
    );
    return addRateLimitHeaders(response, rateLimitResult);
  }

  try {
    const { url, label, gainDb } = await req.json();
    const { id } = await params;
    
    const sample = await prisma.sample.create({
      data: {
        zoneId: parseInt(id),
        url,
        label: label || '',
        gainDb: gainDb || 0,
      }
    });
    const response = NextResponse.json(sample);
    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    console.error('Error creating sample:', error);
    const response = NextResponse.json(
      { error: 'Failed to create sample', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    return addRateLimitHeaders(response, rateLimitResult);
  }
}