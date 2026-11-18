export async function checkRateLimit(store, bucketKey, { maxAttempts = 5, windowMs = 15 * 60 * 1000, lockoutMs = 5 * 60 * 1000 } = {}) {
  const now = Date.now();
  const existing = await store.getRateLimit(bucketKey);

  if (existing?.locked_until) {
    const lockedUntilMs = new Date(existing.locked_until).getTime();
    if (lockedUntilMs > now) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((lockedUntilMs - now) / 1000),
      };
    }
  }

  if (existing?.window_started_at) {
    const windowAge = now - new Date(existing.window_started_at).getTime();
    if (windowAge > windowMs) {
      await store.resetRateLimit(bucketKey);
      return { allowed: true, attempts: 0, remaining: maxAttempts };
    }
  }

  const attempts = existing?.attempts || 0;
  if (attempts >= maxAttempts) {
    const lockedUntil = new Date(now + lockoutMs).toISOString();
    await store.upsertRateLimit({
      bucket_key: bucketKey,
      attempts,
      window_started_at: existing?.window_started_at || new Date(now).toISOString(),
      locked_until: lockedUntil,
    });
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(lockoutMs / 1000),
    };
  }

  return { allowed: true, attempts, remaining: maxAttempts - attempts };
}

export async function recordFailedAttempt(store, bucketKey, { maxAttempts = 5, windowMs = 15 * 60 * 1000, lockoutMs = 5 * 60 * 1000 } = {}) {
  const now = Date.now();
  const existing = await store.getRateLimit(bucketKey);
  const windowExpired =
    !existing?.window_started_at || now - new Date(existing.window_started_at).getTime() > windowMs;

  const attempts = windowExpired ? 1 : (existing.attempts || 0) + 1;
  const windowStarted = windowExpired ? new Date(now).toISOString() : existing.window_started_at;
  const lockedUntil = attempts >= maxAttempts ? new Date(now + lockoutMs).toISOString() : null;

  await store.upsertRateLimit({
    bucket_key: bucketKey,
    attempts,
    window_started_at: windowStarted,
    locked_until: lockedUntil,
  });

  return {
    attempts,
    remaining: Math.max(0, maxAttempts - attempts),
    lockedOut: Boolean(lockedUntil),
    retryAfterSeconds: lockedUntil ? Math.ceil(lockoutMs / 1000) : 0,
  };
}

export async function clearRateLimit(store, bucketKey) {
  await store.resetRateLimit(bucketKey);
}
