import { NextResponse } from 'next/server';
import { animations } from '@/lib/animations';

export async function GET() {
  const list = Object.values(animations).map(a => ({
    key: a.key, name: a.name, schema: a.schema
  }));
  return NextResponse.json({ animations: list });
}