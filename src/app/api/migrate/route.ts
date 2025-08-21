import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function POST() {
  try {
    // Try to create the Settings table if it doesn't exist (PostgreSQL syntax)
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Settings" (
        "id" INTEGER PRIMARY KEY DEFAULT 1,
        "globalScale" DOUBLE PRECISION DEFAULT 1.0
      );
    `;
    
    // Insert default record if none exists (PostgreSQL syntax)
    await prisma.$executeRaw`
      INSERT INTO "Settings" ("id", "globalScale") 
      VALUES (1, 1.0) 
      ON CONFLICT ("id") DO NOTHING;
    `;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Settings table created and initialized successfully' 
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}