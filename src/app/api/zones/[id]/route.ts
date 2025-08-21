import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const zone = await prisma.zone.findUnique({
    where: { id: parseInt(id) },
    include: { samples: true }
  });
  
  if (!zone) {
    return NextResponse.json({ error: 'Zone not found' }, { status: 404 });
  }
  
  return NextResponse.json(zone);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { label, animationKey, animationCfg, isActive } = await req.json();
  const { id } = await params;
  
  const zone = await prisma.zone.update({
    where: { id: parseInt(id) },
    data: {
      ...(label !== undefined && { label }),
      ...(animationKey !== undefined && { animationKey }),
      ...(animationCfg !== undefined && { animationCfg }),
      ...(isActive !== undefined && { isActive }),
    },
    include: { samples: true }
  });
  
  return NextResponse.json(zone);
}