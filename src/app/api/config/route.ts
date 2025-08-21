import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getTempGlobalScale } from '@/lib/temp-storage';

export async function GET() {
  const zones = await prisma.zone.findMany({
    include: { samples: true },
    orderBy: { id: 'asc' }
  });
  
  // Get global settings with fallback
  let globalScale = 1.0;
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
  
  return NextResponse.json({ zones, globalScale });
}