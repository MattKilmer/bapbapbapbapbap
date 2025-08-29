import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const soundboards = await prisma.soundboard.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        isPublic: true,
        plays: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        zones: {
          select: {
            id: true,
            samples: {
              select: {
                id: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const soundboardsWithStats = soundboards.map(sb => ({
      id: sb.id,
      name: sb.name,
      description: sb.description,
      isPublic: sb.isPublic,
      plays: sb.plays,
      createdAt: sb.createdAt.toISOString(),
      updatedAt: sb.updatedAt.toISOString(),
      creator: sb.user,
      zonesWithSamples: sb.zones.filter(zone => zone.samples.length > 0).length,
      totalZones: sb.zones.length
    }));

    return NextResponse.json({ soundboards: soundboardsWithStats });

  } catch (error) {
    console.error('Error fetching soundboards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch soundboards' },
      { status: 500 }
    );
  }
}