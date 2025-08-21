import { NextRequest, NextResponse } from 'next/server';

// In-memory store (for Vercel Edge Functions)
// In production, consider Redis or database for persistence
const requests = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string; // Custom error message
  skipSuccessfulRequests?: boolean;
}

export function rateLimit(config: RateLimitConfig) {
  return async (request: NextRequest) => {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const key = `${ip}:${request.nextUrl.pathname}`;
    const now = Date.now();
    
    // Clean up expired entries periodically
    if (Math.random() < 0.1) {
      for (const [k, v] of requests.entries()) {
        if (now > v.resetTime) {
          requests.delete(k);
        }
      }
    }

    const current = requests.get(key);
    const resetTime = now + config.windowMs;

    if (!current || now > current.resetTime) {
      // First request or window expired
      requests.set(key, { count: 1, resetTime });
      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        reset: resetTime
      };
    }

    if (current.count >= config.maxRequests) {
      // Rate limit exceeded
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        reset: current.resetTime,
        error: config.message || 'Rate limit exceeded. Too many requests.'
      };
    }

    // Increment counter
    current.count++;
    requests.set(key, current);

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - current.count,
      reset: current.resetTime
    };
  };
}

// Predefined rate limiters for different endpoint types
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 uploads per minute
  message: 'Too many upload requests. Please wait before uploading more files.'
});

export const adminRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute  
  maxRequests: 50, // 50 admin requests per minute
  message: 'Too many admin requests. Please slow down.'
});

export const generalRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 general requests per minute
  message: 'Too many requests. Please slow down.'
});

// Helper to add rate limit headers to response
export function addRateLimitHeaders(response: NextResponse, rateLimitResult: any) {
  response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());
  return response;
}