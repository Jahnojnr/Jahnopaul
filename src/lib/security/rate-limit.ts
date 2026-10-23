/**
 * Best-effort in-memory rate limiting for the public contact endpoint.
 *
 * Serverless instances are short-lived and not shared, so this is a first line
 * of defence rather than a guarantee. If contact traffic grows, move the same
 * interface to a shared store (for example Upstash Redis) without changing the
 * call sites.
 */

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 5000;

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_KEYS) {
      for (const [bucketKey, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(bucketKey);
      }
      if (buckets.size >= MAX_TRACKED_KEYS) buckets.clear();
    }

    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Key submissions by a coarse client identifier. The raw address is never
 * stored or logged; only a short, salted digest is kept in memory.
 */
export async function clientKeyFromHeaders(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for") ?? "";
  const address = forwarded.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
  const salt = process.env.CONTACT_RATE_LIMIT_SALT ?? "portfolio-contact";

  const data = new TextEncoder().encode(`${salt}:${address}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(digest).slice(0, 12));

  return bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
