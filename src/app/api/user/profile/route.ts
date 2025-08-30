import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { db as prisma } from '@/lib/db';

// Username validation function
function validateUsername(username: string): { valid: boolean; error?: string } {
  // Check length (3-20 characters)
  if (username.length < 3 || username.length > 20) {
    return { valid: false, error: 'Username must be between 3 and 20 characters' };
  }

  // Check alphanumeric and underscores only
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  // Check it doesn't start or end with underscore
  if (username.startsWith('_') || username.endsWith('_')) {
    return { valid: false, error: 'Username cannot start or end with an underscore' };
  }

  // Check for reserved usernames
  const reserved = ['admin', 'api', 'www', 'mail', 'support', 'help', 'info', 'contact', 'about', 'terms', 'privacy', 'dashboard', 'explore', 'play', 'soundboard', 'user', 'users', 'auth', 'login', 'signup', 'signin'];
  if (reserved.includes(username.toLowerCase())) {
    return { valid: false, error: 'This username is reserved and cannot be used' };
  }

  return { valid: true };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        customImage: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name, username, customImage } = body;

    // Validate input
    if (name === undefined && username === undefined && customImage === undefined) {
      return NextResponse.json(
        { error: 'At least one field (name, username, or customImage) is required' },
        { status: 400 }
      );
    }

    const updateData: { name?: string; username?: string; customImage?: string | null } = {};

    // Validate and prepare name update
    if (name !== undefined) {
      const trimmedName = name.trim();
      if (trimmedName.length === 0) {
        return NextResponse.json(
          { error: 'Name cannot be empty' },
          { status: 400 }
        );
      }
      if (trimmedName.length > 50) {
        return NextResponse.json(
          { error: 'Name cannot be longer than 50 characters' },
          { status: 400 }
        );
      }
      updateData.name = trimmedName;
    }

    // Validate and prepare username update
    if (username !== undefined) {
      const trimmedUsername = username.trim().toLowerCase();
      
      const validation = validateUsername(trimmedUsername);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      // Check if username is already taken (by someone else)
      const existingUser = await prisma.user.findUnique({
        where: { username: trimmedUsername },
        select: { id: true }
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 409 }
        );
      }

      updateData.username = trimmedUsername;
    }

    // Handle customImage update
    if (customImage !== undefined) {
      updateData.customImage = customImage;
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        customImage: true,
        role: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}