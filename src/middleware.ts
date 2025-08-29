import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ADMIN_PATHS = [/^\/admin($|\/)/, /^\/api\/admin($|\/)/];

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  
  if (ADMIN_PATHS.some((re) => re.test(url.pathname))) {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      // Not authenticated - redirect to signin
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    
    if (token.role !== 'ADMIN') {
      // Authenticated but not admin - redirect to access denied
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };