import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const publicOnly = searchParams.get('publicOnly') === 'true';
  
  const session = await getServerSession(authOptions);
  
  let where: any = {};
  
  if (userId) {
    // Get soundboards for specific user
    where.userId = userId;
    // Only show public ones unless it's the user's own soundboards
    if (!session || session.user.id !== userId) {
      where.isPublic = true;
    }
  } else if (publicOnly) {
    // Get all public soundboards
    where.isPublic = true;
  } else if (session) {
    // Get user's own soundboards
    where.userId = session.user.id;
  } else {
    // Non-authenticated users can only see public soundboards
    where.isPublic = true;
  }

  const soundboards = await prisma.soundboard.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      zones: {
        include: { samples: true },
        orderBy: { position: 'asc' }
      },
      _count: {
        select: { zones: true }
      }
    },
    orderBy: [
      { plays: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  // Transform data for response
  const transformedSoundboards = soundboards.map(soundboard => ({
    id: soundboard.id,
    name: soundboard.name,
    description: soundboard.description,
    slug: soundboard.slug,
    isPublic: soundboard.isPublic,
    isPremium: soundboard.isPremium,
    price: soundboard.price,
    plays: soundboard.plays,
    likes: soundboard.likes,
    zonesWithSamples: soundboard.zones.filter(zone => zone.samples.length > 0).length,
    totalZones: soundboard._count.zones,
    creator: soundboard.user,
    createdAt: soundboard.createdAt,
    updatedAt: soundboard.updatedAt
  }));

  return NextResponse.json({ soundboards: transformedSoundboards });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const { name, description, isPublic } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Soundboard name is required' },
        { status: 400 }
      );
    }

    // Create soundboard with 16 empty zones
    const soundboard = await prisma.soundboard.create({
      data: {
        name: name.trim(),
        description: description?.trim() || '',
        isPublic: isPublic !== false, // Default to true unless explicitly false
        userId: session.user.id,
        zones: {
          create: Array.from({ length: 16 }, (_, i) => ({
            position: i + 1,
            label: '',
            animationKey: 'burst',
            isActive: true,
          }))
        }
      },
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

    return NextResponse.json({ 
      soundboard: {
        id: soundboard.id,
        name: soundboard.name,
        description: soundboard.description,
        isPublic: soundboard.isPublic,
        zones: soundboard.zones,
        creator: soundboard.user,
        createdAt: soundboard.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating soundboard:', error);
    return NextResponse.json(
      { error: 'Failed to create soundboard' },
      { status: 500 }
    );
  }
}