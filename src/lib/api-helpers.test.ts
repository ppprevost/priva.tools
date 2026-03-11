import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRateLimiter, requireAdmin, requireAuth, isMobileClient } from './api-helpers';

const makeRequest = (opts: { origin?: string; authorization?: string; apiKey?: string } = {}) => {
  const headers = new Headers();
  if (opts.origin) headers.set('Origin', opts.origin);
  if (opts.authorization) headers.set('Authorization', opts.authorization);
  if (opts.apiKey) headers.set('X-API-Key', opts.apiKey);
  return new Request('https://priva.tools/api/test', { headers });
};

describe('createRateLimiter', () => {
  it('allows requests under the limit', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 3 });
    expect(limiter('1.2.3.4')).toBe(false);
    expect(limiter('1.2.3.4')).toBe(false);
    expect(limiter('1.2.3.4')).toBe(false);
  });

  it('blocks when limit is exceeded', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 2 });
    limiter('1.2.3.4');
    limiter('1.2.3.4');
    expect(limiter('1.2.3.4')).toBe(true);
  });

  it('resets after the window expires', () => {
    vi.useFakeTimers();
    const limiter = createRateLimiter({ windowMs: 1_000, max: 1 });
    limiter('1.2.3.4');
    expect(limiter('1.2.3.4')).toBe(true);
    vi.advanceTimersByTime(1_001);
    expect(limiter('1.2.3.4')).toBe(false);
    vi.useRealTimers();
  });

  it('triggers lockout after threshold', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 2, lockoutThreshold: 3, lockoutDurationMs: 5_000 });
    limiter('5.5.5.5');
    limiter('5.5.5.5');
    limiter('5.5.5.5');
    expect(limiter('5.5.5.5')).toBe(true);
  });

  it('re-locks immediately after lockout expires (count not reset within window)', () => {
    vi.useFakeTimers();
    const limiter = createRateLimiter({ windowMs: 60_000, max: 1, lockoutThreshold: 2, lockoutDurationMs: 5_000 });
    limiter('6.6.6.6');
    limiter('6.6.6.6');
    limiter('6.6.6.6'); // triggers lockout
    vi.advanceTimersByTime(5_001); // lockout expires, but count is NOT reset
    expect(limiter('6.6.6.6')).toBe(true); // re-locks immediately — known limitation
    vi.useRealTimers();
  });

  it('allows again after both lockout and window expire', () => {
    vi.useFakeTimers();
    const limiter = createRateLimiter({ windowMs: 10_000, max: 1, lockoutThreshold: 2, lockoutDurationMs: 5_000 });
    limiter('7.7.7.7');
    limiter('7.7.7.7');
    limiter('7.7.7.7'); // triggers lockout
    vi.advanceTimersByTime(10_001); // window expires → count resets
    expect(limiter('7.7.7.7')).toBe(false);
    vi.useRealTimers();
  });

  it('tracks IPs independently', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 1 });
    limiter('1.1.1.1');
    expect(limiter('1.1.1.1')).toBe(true);
    expect(limiter('2.2.2.2')).toBe(false);
  });
});

describe('requireAdmin', () => {
  afterEach(() => { delete process.env.ADMIN_SECRET; });

  it('returns 503 when ADMIN_SECRET is not set', () => {
    expect(requireAdmin(makeRequest())?.status).toBe(503);
  });

  it('returns 401 when no Authorization header', () => {
    process.env.ADMIN_SECRET = 'secret123';
    expect(requireAdmin(makeRequest())?.status).toBe(401);
  });

  it('returns 401 for wrong token', () => {
    process.env.ADMIN_SECRET = 'secret123';
    expect(requireAdmin(makeRequest({ authorization: 'Bearer wrong' }))?.status).toBe(401);
  });

  it('returns null for correct token', () => {
    process.env.ADMIN_SECRET = 'secret123';
    expect(requireAdmin(makeRequest({ authorization: 'Bearer secret123' }))).toBeNull();
  });
});

describe('requireAuth', () => {
  afterEach(() => { delete process.env.MOBILE_API_KEY; });

  it('returns 403 when no Origin header', () => {
    expect(requireAuth(makeRequest())?.status).toBe(403);
  });

  it('returns 403 for a disallowed origin', () => {
    expect(requireAuth(makeRequest({ origin: 'https://evil.com' }))?.status).toBe(403);
  });

  it('returns null for an allowed origin', () => {
    expect(requireAuth(makeRequest({ origin: 'https://priva.tools' }))).toBeNull();
  });

  it('bypasses origin check for valid mobile API key', () => {
    process.env.MOBILE_API_KEY = 'mobile-key-abc';
    expect(requireAuth(makeRequest({ apiKey: 'mobile-key-abc' }))).toBeNull();
  });
});

describe('isMobileClient', () => {
  afterEach(() => { delete process.env.MOBILE_API_KEY; });

  it('returns false when no X-API-Key header', () => {
    process.env.MOBILE_API_KEY = 'key';
    expect(isMobileClient(makeRequest())).toBe(false);
  });

  it('returns false when MOBILE_API_KEY env not set', () => {
    expect(isMobileClient(makeRequest({ apiKey: 'key' }))).toBe(false);
  });

  it('returns false when key does not match', () => {
    process.env.MOBILE_API_KEY = 'real-key';
    expect(isMobileClient(makeRequest({ apiKey: 'wrong-key' }))).toBe(false);
  });

  it('returns true when key matches', () => {
    process.env.MOBILE_API_KEY = 'real-key';
    expect(isMobileClient(makeRequest({ apiKey: 'real-key' }))).toBe(true);
  });
});
