/**
 * Shared rate limiter for Next.js API routes.
 * Provides per-IP rate limiting with automatic window expiry to prevent memory leaks.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

/**
 * Creates a rate limiter function with specified limits and window duration.
 * The limiter automatically cleans up expired entries to prevent memory leaks.
 *
 * @param maxRequests Maximum requests allowed per window
 * @param windowMs Duration of the rate limit window in milliseconds
 */
export function createRateLimiter(
  maxRequests: number,
  windowMs: number,
): (ip: string) => boolean {
  const rateLimitMap = new Map<string, RateLimitEntry>();

  return (ip: string): boolean => {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    // Clean up expired entries
    if (!entry || now - entry.windowStart > windowMs) {
      rateLimitMap.set(ip, { count: 1, windowStart: now });
      return false;
    }

    entry.count += 1;
    return entry.count > maxRequests;
  };
}

/**
 * Extracts the client IP address from request headers.
 * Checks x-forwarded-for (proxy) and x-real-ip (nginx) headers.
 * **Security note**: These headers can be spoofed if the request is not from a
 * trusted proxy. Ensure your reverse proxy (e.g., Cloudflare, AWS ALB) sets these
 * headers and that your application only trusts requests from known proxies.
 *
 * @param headers Request headers
 * @returns Client IP address or "unknown" if not found
 */
export function getClientIp(headers: Headers): string {
  // x-forwarded-for may contain multiple IPs (client, proxy1, proxy2, ...)
  // Take the first IP which should be the client
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}
