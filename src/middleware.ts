import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PATHS = [/^\/admin($|\/)/, /^\/api\/admin($|\/)/];

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (ADMIN_PATHS.some((re) => re.test(url.pathname))) {
    const cookie = req.cookies.get('adm')?.value;
    if (cookie !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };