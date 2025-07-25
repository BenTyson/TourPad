import { NextResponse } from 'next/server';

// Memory management for API routes
export function withMemoryManagement<T extends (...args: any[]) => any>(
  handler: T
): T {
  return (async (...args) => {
    try {
      const result = await handler(...args);
      
      // Force garbage collection if available in development
      if (process.env.NODE_ENV === 'development' && global.gc) {
        global.gc();
      }
      
      return result;
    } catch (error) {
      console.error('API Error:', error);
      
      // Clean up on error
      if (process.env.NODE_ENV === 'development' && global.gc) {
        global.gc();
      }
      
      throw error;
    }
  }) as T;
}

// Rate limiting helper
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const userLimit = requestCounts.get(identifier);
  
  if (!userLimit || now > userLimit.resetTime) {
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 300000); // Clean up every 5 minutes