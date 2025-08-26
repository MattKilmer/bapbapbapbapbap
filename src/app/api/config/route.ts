import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getTempGlobalScale } from '@/lib/temp-storage';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const soundboardId = searchParams.get('soundboardId');
  
  let zones;
  let globalScale = 1.0;
  let soundboard = null;

  if (soundboardId) {
    // Load specific soundboard
    soundboard = await prisma.soundboard.findUnique({
      where: { id: soundboardId },
      include: {
        zones: {
          include: { samples: true },
          orderBy: { id: 'asc' }
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
          orderBy: { id: 'asc' }
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
      // Fallback to legacy behavior if no soundboards exist
      zones = await prisma.zone.findMany({
        where: { soundboardId: null },
        include: { samples: true },
        orderBy: { id: 'asc' }
      });
      
      // Get global settings with fallback
      try {
        const settings = await prisma.settings.findFirst();
        if (settings) {
          globalScale = settings.globalScale;
        }
      } catch (error) {
        console.log('Settings table not available yet, using temp storage');
        globalScale = getTempGlobalScale();
        console.log('Config API returning globalScale from temp storage:', globalScale);
      }
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