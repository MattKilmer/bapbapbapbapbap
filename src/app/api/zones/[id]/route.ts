import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { db as prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth-config';

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

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

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