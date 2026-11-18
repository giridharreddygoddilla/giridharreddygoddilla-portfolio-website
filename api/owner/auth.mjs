import crypto from 'crypto';
import {
  OWNER_COOKIE_NAME,
  clearCookieHeader,
  generateSessionToken,
  hashClientIp,
  hashSecret,
  jsonResponse,
  parseCookies,
  serializeCookie,
  sha256Hex,
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
import { verifyOwnerSession } from '../_lib/authHelpers.mjs';
import { getRecoveryProviderStatus } from '../_lib/otpDelivery.mjs';

const OWNER_SESSION_TTL_SECONDS = 4 * 60 * 60; // 4 hours

function safeTimingEqual(a, b) {
  const bufA = Buffer.from(String(a || ''), 'utf8');
  const bufB = Buffer.from(String(b || ''), 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function GET(request) {
  try {
    const providerStatus = getRecoveryProviderStatus();

    if (!isDatabaseConfigured()) {
      return jsonResponse({
        backendConfigured: false,
        missingDatabaseVars: getMissingDatabaseVars(),
        authenticated: false,
        ownerInitialized: false,
        bootstrapConfigured: Boolean((process.env.OWNER_BOOTSTRAP_SECRET || '').trim()),
        recoveryProviders: {
          emailConfigured: providerStatus.emailConfigured,
          smsConfigured: providerStatus.smsConfigured,
          missingEmailVars: providerStatus.missingEmailVars,
          missingSmsVars: providerStatus.missingSmsVars,
        },
      });
    }

    const store = getStore();
    const ownerConfig = await store.getOwnerConfig();
    const sessionCheck = await verifyOwnerSession(request, store);

    return jsonResponse({
      backendConfigured: true,
      authenticated: sessionCheck.authenticated,
      ownerInitialized: Boolean(ownerConfig.owner_password_hash),
      bootstrapConfigured: Boolean((process.env.OWNER_BOOTSTRAP_SECRET || '').trim()),
      recoveryStatus: sessionCheck.authenticated
        ? {
            emailVerified: Boolean(ownerConfig.recovery_email_verified),
            phoneVerified: Boolean(ownerConfig.recovery_phone_verified),
            maskedEmail: providerStatus.maskedEmail,
            maskedPhone: providerStatus.maskedPhone,
            backupCodesRemaining: Array.isArray(ownerConfig.backup_code_hashes)
              ? ownerConfig.backup_code_hashes.length
              : 0,
          }
        : {
            emailVerified: Boolean(ownerConfig.recovery_email_verified),
            phoneVerified: Boolean(ownerConfig.recovery_phone_verified),
            backupCodesConfigured:
              Array.isArray(ownerConfig.backup_code_hashes) &&
              ownerConfig.backup_code_hashes.length > 0,
          },
      recoveryProviders: {
        emailConfigured: providerStatus.emailConfigured,
        smsConfigured: providerStatus.smsConfigured,
        missingEmailVars: providerStatus.missingEmailVars,
        missingSmsVars: providerStatus.missingSmsVars,
      },
    });
  } catch (err) {
    console.error('[GET /api/owner/auth]', err);
    return jsonResponse({ error: 'Unable to check owner authentication status.' }, 500);
  }
}

export async function POST(request) {
  try {
    if (!isDatabaseConfigured()) {
      return jsonResponse(
        {
          success: false,
          error: `Database backend is not configured. Missing: ${getMissingDatabaseVars().join(', ')}.`,
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

    const { action = 'login', password, bootstrapSecret } = body || {};
    if (typeof password !== 'string' || password.trim().length < 8) {
      return jsonResponse(
        { success: false, error: 'Owner password must be at least 8 characters long.' },
        400
      );
    }

    const store = getStore();
    const ipHash = hashClientIp(request);
    const rateBucket = `owner_auth:${ipHash}`;

    const limit = await checkRateLimit(store, rateBucket, {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000,
      lockoutMs: 10 * 60 * 1000,
    });

    if (!limit.allowed) {
      await store.logAudit({
        event_type: 'owner_auth_rate_limited',
        ip_hash: ipHash,
        success: false,
      });
      return jsonResponse(
        {
          success: false,
          error: `Too many failed attempts. Please wait ${limit.retryAfterSeconds}s before retrying.`,
          lockoutSeconds: limit.retryAfterSeconds,
        },
        429
      );
    }

    const ownerConfig = await store.getOwnerConfig();

    // First-time owner setup requires OWNER_BOOTSTRAP_SECRET from server env
    if (action === 'initialize' || !ownerConfig.owner_password_hash) {
      if (ownerConfig.owner_password_hash) {
        return jsonResponse(
          { success: false, error: 'Owner security is already initialized. Please sign in.' },
          409
        );
      }

      const expectedBootstrap = (process.env.OWNER_BOOTSTRAP_SECRET || '').trim();
      if (!expectedBootstrap) {
        return jsonResponse(
          {
            success: false,
            error:
              'Owner setup requires OWNER_BOOTSTRAP_SECRET to be configured in Vercel Environment Variables so visitors cannot initialize owner access.',
          },
          503
        );
      }

      if (!safeTimingEqual(bootstrapSecret, expectedBootstrap)) {
        await recordFailedAttempt(store, rateBucket, {
          maxAttempts: 5,
          windowMs: 15 * 60 * 1000,
          lockoutMs: 10 * 60 * 1000,
        });
        await store.logAudit({
          event_type: 'owner_bootstrap_failed',
          ip_hash: ipHash,
          success: false,
        });
        return jsonResponse({ success: false, error: 'Invalid owner bootstrap secret.' }, 401);
      }

      const ownerPasswordHash = await hashSecret(password.trim());
      const updated = await store.updateOwnerConfig({
        owner_password_hash: ownerPasswordHash,
        owner_session_version: 1,
      });

      await clearRateLimit(store, rateBucket);
      const { token, tokenHash } = generateSessionToken();
      await store.createSession({
        token_hash: tokenHash,
        session_type: 'owner',
        profile_id: null,
        session_version: updated.owner_session_version || 1,
        expires_at: new Date(Date.now() + OWNER_SESSION_TTL_SECONDS * 1000).toISOString(),
        ip_hash: ipHash,
        user_agent: (request.headers.get('user-agent') || '').slice(0, 200),
      });

      await store.logAudit({
        event_type: 'owner_initialized',
        ip_hash: ipHash,
        success: true,
      });

      return jsonResponse(
        { success: true, authenticated: true, initialized: true },
        200,
        {
          'Set-Cookie': serializeCookie(OWNER_COOKIE_NAME, token, OWNER_SESSION_TTL_SECONDS),
        }
      );
    }

    // Standard owner sign-in
    const valid = await verifySecret(password.trim(), ownerConfig.owner_password_hash);
    if (!valid) {
      const failState = await recordFailedAttempt(store, rateBucket, {
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000,
        lockoutMs: 10 * 60 * 1000,
      });
      await store.logAudit({
        event_type: 'owner_login_failed',
        ip_hash: ipHash,
        success: false,
      });
      return jsonResponse(
        {
          success: false,
          error: failState.lockedOut
            ? `Authentication locked for ${failState.retryAfterSeconds}s due to repeated failed attempts.`
            : 'Invalid owner credentials.',
          remainingAttempts: failState.remaining,
          lockoutSeconds: failState.retryAfterSeconds || undefined,
        },
        failState.lockedOut ? 429 : 401
      );
    }

    await clearRateLimit(store, rateBucket);
    const { token, tokenHash } = generateSessionToken();
    await store.createSession({
      token_hash: tokenHash,
      session_type: 'owner',
      profile_id: null,
      session_version: ownerConfig.owner_session_version || 1,
      expires_at: new Date(Date.now() + OWNER_SESSION_TTL_SECONDS * 1000).toISOString(),
      ip_hash: ipHash,
      user_agent: (request.headers.get('user-agent') || '').slice(0, 200),
    });

    await store.logAudit({
      event_type: 'owner_login_success',
      ip_hash: ipHash,
      success: true,
    });

    return jsonResponse(
      { success: true, authenticated: true },
      200,
      {
        'Set-Cookie': serializeCookie(OWNER_COOKIE_NAME, token, OWNER_SESSION_TTL_SECONDS),
      }
    );
  } catch (err) {
    console.error('[POST /api/owner/auth]', err);
    return jsonResponse({ success: false, error: 'Owner authentication failed.' }, 500);
  }
}

export async function DELETE(request) {
  try {
    if (isDatabaseConfigured()) {
      const store = getStore();
      const cookies = parseCookies(request);
      const rawToken = cookies[OWNER_COOKIE_NAME];
      if (rawToken) {
        await store.revokeSession(sha256Hex(rawToken));
      }
    }
    return jsonResponse(
      { success: true, authenticated: false },
      200,
      { 'Set-Cookie': clearCookieHeader(OWNER_COOKIE_NAME) }
    );
  } catch (err) {
    console.error('[DELETE /api/owner/auth]', err);
    return jsonResponse({ success: false, error: 'Sign out failed.' }, 500);
  }
}
