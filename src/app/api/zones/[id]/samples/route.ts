import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const samples = await prisma.sample.findMany({
    where: { zoneId: parseInt(id) },
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({ samples });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { url, label, gainDb } = await req.json();
    const { id } = await params;
    
    console.log('Creating sample:', { zoneId: parseInt(id), url, label, gainDb });
    
    const sample = await prisma.sample.create({
      data: {
        zoneId: parseInt(id),
        url,
        label: label || '',
        gainDb: gainDb || 0,
      }
    });
    
    console.log('Sample created:', sample);
    return NextResponse.json(sample);
  } catch (error) {
    console.error('Error creating sample:', error);
    return NextResponse.json(
      { error: 'Failed to create sample', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}