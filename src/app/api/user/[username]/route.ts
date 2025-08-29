import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        role: true,
        createdAt: true,
        soundboards: {
          where: {
            isPublic: true
          },
          select: {
            id: true,
            name: true,
            description: true,
            plays: true,
            likes: true,
            createdAt: true,
            zones: {
              where: {
                samples: {
                  some: {}
                }
              },
              select: {
                id: true
              }
            }
          },
          orderBy: {
            updatedAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Add zone count to each soundboard
    const soundboardsWithZoneCount = user.soundboards.map(sb => ({
      ...sb,
      activeZones: sb.zones.length
    }));

    return NextResponse.json({
      user: {
        ...user,
        soundboards: soundboardsWithZoneCount
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}