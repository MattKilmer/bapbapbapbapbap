import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { db as prisma } from '@/lib/db';
import { uploadRateLimit, addRateLimitHeaders } from '@/lib/rate-limit';
import { authOptions } from '@/lib/auth-config';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const samples = await prisma.sample.findMany({
    where: { zoneId: parseInt(id) },
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({ samples });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

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