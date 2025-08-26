import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const { globalScale } = await request.json();

    // Verify user owns this soundboard
    const soundboard = await prisma.soundboard.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!soundboard) {
      return NextResponse.json(
        { error: 'Soundboard not found' },
        { status: 404 }
      );
    }

    if (soundboard.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    // Update soundboard settings
    const updatedSoundboard = await prisma.soundboard.update({
      where: { id },
      data: { 
        globalScale: globalScale !== undefined ? globalScale : undefined 
      },
      select: {
        id: true,
        globalScale: true
      }
    });

    return NextResponse.json({ soundboard: updatedSoundboard });
  } catch (error) {
    console.error('Error updating soundboard settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}