import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getTempGlobalScale, setTempGlobalScale } from '@/lib/temp-storage';

export async function GET() {
  try {
    // First try to ensure the Settings table exists
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Settings" (
        "id" INTEGER PRIMARY KEY DEFAULT 1,
        "globalScale" DOUBLE PRECISION DEFAULT 1.0
      );
    `;
    
    let settings = await prisma.settings.findFirst();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 1,
          globalScale: 1.0
        }
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings GET error (table may not exist yet):', error);
    // Use temporary storage
    return NextResponse.json({ id: 1, globalScale: getTempGlobalScale() }, { status: 200 });
  }
}

export async function POST(request: Request) {
  const { globalScale } = await request.json();
  
  try {
    // First try to ensure the Settings table exists
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Settings" (
        "id" INTEGER PRIMARY KEY DEFAULT 1,
        "globalScale" DOUBLE PRECISION DEFAULT 1.0
      );
    `;
    
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: { globalScale },
      create: { id: 1, globalScale }
    });
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings POST error (table may not exist yet):', error);
    // Use temporary storage as fallback
    setTempGlobalScale(globalScale);
    console.log('Saved to temp storage:', globalScale);
    return NextResponse.json({ id: 1, globalScale }, { status: 200 });
  }
}