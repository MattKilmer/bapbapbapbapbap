import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Increment play count
    await prisma.soundboard.update({
      where: { id },
      data: {
        plays: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error incrementing play count:', error);
    return NextResponse.json(
      { error: 'Failed to update play count' },
      { status: 500 }
    );
  }
}