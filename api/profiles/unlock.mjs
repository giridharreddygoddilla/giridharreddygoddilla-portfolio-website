import {
  generateSessionToken,
  hashClientIp,
  isValidProfileId,
  jsonResponse,
  profileCookieName,
  serializeCookie,
  verifySecret,
} from '../_lib/crypto.mjs';
import {
  getMissingDatabaseVars,
  getStore,
  isDatabaseConfigured,
} from '../_lib/store.mjs';
import {
  checkRateLimit,
  clearRateLimit,
  recordFailedAttempt,
} from '../_lib/rateLimit.mjs';

const PROFILE_SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 hours

export async function POST(request) {
  try {
    if (!isDatabaseConfigured()) {
      return jsonResponse(
        {
          success: false,
          backendConfigured: false,
          error: `Persistent security backend is not configured. Missing: ${getMissingDatabaseVars().join(', ')}.`,
        },
        503
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ success: false, error: 'Invalid request body.' }, 400);
    }

    const { profileId, password } = body || {};
    if (!isValidProfileId(profileId)) {
      return jsonResponse({ success: false, error: 'Invalid profile requested.' }, 400);
    }

    if (typeof password !== 'string' || !password.trim()) {
      return jsonResponse({ success: false, error: 'Please enter a password.' }, 400);
    }

    const store = getStore();
    const ipHash = hashClientIp(request);
    const rateBucket = `profile_unlock:${ipHash}:${profileId}`;

    const limit = await checkRateLimit(store, rateBucket, {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000,
      lockoutMs: 5 * 60 * 1000,
    });

    if (!limit.allowed) {
      await store.logAudit({
        event_type: 'profile_unlock_rate_limited',
        profile_id: profileId,
        ip_hash: ipHash,
        success: false,
      });
      return jsonResponse(
        {
          success: false,
          error: `Too many failed attempts. Please wait ${limit.retryAfterSeconds}s before trying again.`,
          lockoutSeconds: limit.retryAfterSeconds,
        },
        429
      );
    }

    const lockRow = await store.getProfileLock(profileId);
    if (!lockRow || !lockRow.is_locked || !lockRow.password_hash) {
      return jsonResponse({ success: true, unlocked: true, profileId });
    }

    const valid = await verifySecret(password, lockRow.password_hash);
    if (!valid) {
      const failState = await recordFailedAttempt(store, rateBucket, {
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000,
        lockoutMs: 5 * 60 * 1000,
      });

      await store.logAudit({
        event_type: 'profile_unlock_failed',
        profile_id: profileId,
        ip_hash: ipHash,
        success: false,
      });

      return jsonResponse(
        {
          success: false,
          error: failState.lockedOut
            ? `Access denied. Locked out for ${failState.retryAfterSeconds}s due to repeated failed attempts.`
            : 'Incorrect password. Access denied.',
          remainingAttempts: failState.remaining,
          lockoutSeconds: failState.retryAfterSeconds || undefined,
        },
        failState.lockedOut ? 429 : 401
      );
    }

    // Valid password: clear rate limit, create server-managed session, issue HTTP-only cookie
    await clearRateLimit(store, rateBucket);
    const { token, tokenHash } = generateSessionToken();
    const expiresAt = new Date(Date.now() + PROFILE_SESSION_TTL_SECONDS * 1000).toISOString();

    await store.createSession({
      token_hash: tokenHash,
      session_type: 'profile',
      profile_id: profileId,
      session_version: lockRow.session_version || 1,
      expires_at: expiresAt,
      ip_hash: ipHash,
      user_agent: (request.headers.get('user-agent') || '').slice(0, 200),
    });

    await store.logAudit({
      event_type: 'profile_unlock_success',
      profile_id: profileId,
      ip_hash: ipHash,
      success: true,
    });

    return jsonResponse(
      {
        success: true,
        unlocked: true,
        profileId,
      },
      200,
      {
        'Set-Cookie': serializeCookie(
          profileCookieName(profileId),
          token,
          PROFILE_SESSION_TTL_SECONDS
        ),
      }
    );
  } catch (err) {
    console.error('[POST /api/profiles/unlock]', err);
    return jsonResponse(
      { success: false, error: 'Unable to verify password at this time.' },
      500
    );
  }
}
