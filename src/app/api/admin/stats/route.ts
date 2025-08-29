import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get total users
    const totalUsers = await prisma.user.count();

    // Get total soundboards
    const totalSoundboards = await prisma.soundboard.count();

    // Get total plays across all soundboards
    const playsResult = await prisma.soundboard.aggregate({
      _sum: {
        plays: true
      }
    });
    const totalPlays = playsResult._sum.plays || 0;

    // Get user growth this month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const usersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: oneMonthAgo
        }
      }
    });

    const usersLastMonth = await prisma.user.count({
      where: {
        createdAt: {
          lt: oneMonthAgo
        }
      }
    });

    const userGrowth = usersLastMonth > 0 
      ? Math.round((usersThisMonth / usersLastMonth) * 100) - 100 
      : usersThisMonth > 0 ? 100 : 0;

    // Get active sessions (users who created sessions today)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const activeSessions = await prisma.session.count({
      where: {
        expires: {
          gt: new Date()
        }
      }
    });

    // Get top 5 popular soundboards
    const popularSoundboards = await prisma.soundboard.findMany({
      take: 5,
      orderBy: {
        plays: 'desc'
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    // Get 5 most recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      totalUsers,
      totalSoundboards,
      totalPlays,
      activeSessions,
      userGrowth,
      popularSoundboards: popularSoundboards.map(sb => ({
        id: sb.id,
        name: sb.name,
        plays: sb.plays,
        creator: sb.user.name || sb.user.email
      })),
      recentUsers
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}