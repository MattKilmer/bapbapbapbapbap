import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET() {
  const zones = await prisma.zone.findMany({
    include: { samples: true },
    orderBy: { id: 'asc' }
  });
  return NextResponse.json({ zones });
}