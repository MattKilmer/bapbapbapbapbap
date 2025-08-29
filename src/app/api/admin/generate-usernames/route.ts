import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

function generateUsername(name: string, email: string): string {
  // Try to create username from name first
  if (name) {
    const baseName = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 15);
    if (baseName.length >= 3) {
      return baseName;
    }
  }

  // Fallback to email local part
  const emailLocal = email.split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 15);
  
  return emailLocal.length >= 3 ? emailLocal : 'user';
}

async function generateUniqueUsername(baseName: string, email: string): Promise<string> {
  const baseUsername = generateUsername(baseName, email);
  
  let username = baseUsername;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!existing) {
      return username;
    }
    
    username = `${baseUsername}${counter}`;
    counter++;
    
    // Safety check
    if (counter > 1000) {
      username = `${baseUsername}${Date.now()}`;
      break;
    }
  }
  
  return username;
}

export async function POST(request: NextRequest) {
  try {
    // Find all users without usernames
    const usersWithoutUsernames = await prisma.user.findMany({
      where: {
        username: null
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    const results = [];

    for (const user of usersWithoutUsernames) {
      try {
        const username = await generateUniqueUsername(user.name || '', user.email);
        
        await prisma.user.update({
          where: { id: user.id },
          data: { username }
        });

        results.push({
          userId: user.id,
          email: user.email,
          name: user.name,
          generatedUsername: username
        });
      } catch (error) {
        console.error(`Failed to generate username for user ${user.id}:`, error);
        results.push({
          userId: user.id,
          email: user.email,
          name: user.name,
          error: 'Failed to generate username'
        });
      }
    }

    return NextResponse.json({
      message: `Processed ${usersWithoutUsernames.length} users`,
      results
    });

  } catch (error) {
    console.error('Error generating usernames:', error);
    return NextResponse.json(
      { error: 'Failed to generate usernames' },
      { status: 500 }
    );
  }
}