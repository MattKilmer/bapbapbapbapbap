import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const soundboardId = searchParams.get('soundboardId');
  
  let zones: any[] = [];
  let globalScale = 1.0;
  let soundboard: any = null;

  if (soundboardId) {
    // Load specific soundboard
    soundboard = await prisma.soundboard.findUnique({
      where: { id: soundboardId },
      include: {
        zones: {
          include: { samples: true },
          orderBy: { position: 'asc' }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (soundboard) {
      zones = soundboard.zones;
      globalScale = soundboard.globalScale;
    } else {
      return NextResponse.json(
        { error: 'Soundboard not found' },
        { status: 404 }
      );
    }
  } else {
    // Default behavior - load the default/first public soundboard
    const defaultSoundboard = await prisma.soundboard.findFirst({
      where: { 
        OR: [
          { isPublic: true },
          { user: { role: 'ADMIN' } }
        ]
      },
      include: {
        zones: {
          include: { samples: true },
          orderBy: { position: 'asc' }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    if (defaultSoundboard) {
      zones = defaultSoundboard.zones;
      globalScale = defaultSoundboard.globalScale;
      soundboard = defaultSoundboard;
    } else {
      // No soundboards found - return empty config
      zones = [];
      globalScale = 1.0;
      soundboard = null;
    }
  }
  
  return NextResponse.json({ 
    zones, 
    globalScale,
    soundboard: soundboard ? {
      id: soundboard.id,
      name: soundboard.name,
      description: soundboard.description,
      isPublic: soundboard.isPublic,
      creator: soundboard.user
    } : null
  });
}