import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function DELETE(
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

    // First check if the soundboard exists and if user owns it
    const soundboard = await prisma.soundboard.findUnique({
      where: { id },
      select: { userId: true, name: true }
    });

    if (!soundboard) {
      return NextResponse.json(
        { error: 'Soundboard not found' },
        { status: 404 }
      );
    }

    // Check if user owns this soundboard (or is admin)
    if (soundboard.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    // Delete the soundboard (cascade will handle zones and samples)
    await prisma.soundboard.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Soundboard "${soundboard.name}" deleted successfully` 
    });
  } catch (error) {
    console.error('Error deleting soundboard:', error);
    return NextResponse.json(
      { error: 'Failed to delete soundboard' },
      { status: 500 }
    );
  }
}