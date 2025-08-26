import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function PATCH(
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
    const { isPublic } = await request.json();

    // Validate that isPublic is a boolean
    if (typeof isPublic !== 'boolean') {
      return NextResponse.json(
        { error: 'isPublic must be a boolean value' },
        { status: 400 }
      );
    }

    // First, check if the soundboard exists and user owns it
    const soundboard = await prisma.soundboard.findUnique({
      where: { id },
      select: { 
        id: true, 
        userId: true, 
        name: true, 
        isPublic: true 
      }
    });

    if (!soundboard) {
      return NextResponse.json(
        { error: 'Soundboard not found' },
        { status: 404 }
      );
    }

    // Check ownership (unless admin)
    if (soundboard.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    // Update the visibility
    const updatedSoundboard = await prisma.soundboard.update({
      where: { id },
      data: { isPublic },
      select: {
        id: true,
        name: true,
        isPublic: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      soundboard: updatedSoundboard,
      message: `Soundboard is now ${isPublic ? 'public' : 'private'}`
    });

  } catch (error) {
    console.error('Error updating soundboard visibility:', error);
    return NextResponse.json(
      { error: 'Failed to update soundboard visibility' },
      { status: 500 }
    );
  }
}