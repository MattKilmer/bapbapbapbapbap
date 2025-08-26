import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { db as prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth-config';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sample = await prisma.sample.findUnique({
    where: { id },
    include: { zone: true }
  });
  
  if (!sample) {
    return NextResponse.json({ error: 'Sample not found' }, { status: 404 });
  }
  
  return NextResponse.json(sample);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    await prisma.sample.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Sample not found' }, { status: 404 });
  }
}