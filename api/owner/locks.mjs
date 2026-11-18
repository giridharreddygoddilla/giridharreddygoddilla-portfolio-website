import {
  generateBackupCodes,
  hashClientIp,
  hashSecret,
  isValidProfileId,
  jsonResponse,
} from '../_lib/crypto.mjs';
import {
  getMissingDatabaseVars,
  getStore,
  isDatabaseConfigured,
} from '../_lib/store.mjs';
import { verifyOwnerSession } from '../_lib/authHelpers.mjs';
import { getRecoveryProviderStatus } from '../_lib/otpDelivery.mjs';

export async function GET(request) {
  try {
    if (!isDatabaseConfigured()) {
      return jsonResponse(
        {
          error: `Database backend is not configured. Missing: ${getMissingDatabaseVars().join(', ')}.`,
        },
        503
      );
    }

    const store = getStore();
    const owner = await verifyOwnerSession(request, store);
    if (!owner.authenticated) {
      return jsonResponse({ error: 'Owner authentication required.' }, 401);
    }

    const rows = await store.listProfileLocks();
    const ownerConfig = await store.getOwnerConfig();
    const providerStatus = getRecoveryProviderStatus();
    const recentAudit = await store.getRecentAudit(8);

    // NEVER return password_hash or saved password values
    const profiles = {};
    for (const row of rows) {
      profiles[row.profile_id] = {
        isLocked: Boolean(row.is_locked && row.password_hash),
        hasPassword: Boolean(row.password_hash),
        sessionVersion: row.session_version || 1,
        updatedAt: row.updated_at,
      };
    }

    return jsonResponse({
      profiles,
      securityStatus: {
        emailVerified: Boolean(ownerConfig.recovery_email_verified),
        phoneVerified: Boolean(ownerConfig.recovery_phone_verified),
        maskedEmail: providerStatus.maskedEmail,
        maskedPhone: providerStatus.maskedPhone,
        emailProviderConfigured: providerStatus.emailConfigured,
        smsProviderConfigured: providerStatus.smsConfigured,
        missingEmailVars: providerStatus.missingEmailVars,
        missingSmsVars: providerStatus.missingSmsVars,
        backupCodesRemaining: Array.isArray(ownerConfig.backup_code_hashes)
          ? ownerConfig.backup_code_hashes.length
          : 0,
      },
      recentAudit,
    });
  } catch (err) {
    console.error('[GET /api/owner/locks]', err);
    return jsonResponse({ error: 'Failed to load owner security dashboard.' }, 500);
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

    const store = getStore();
    const owner = await verifyOwnerSession(request, store);
    if (!owner.authenticated) {
      return jsonResponse({ success: false, error: 'Owner authentication required.' }, 401);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ success: false, error: 'Invalid request body.' }, 400);
    }

    const { action, profileId, password, isLocked } = body || {};
    const ipHash = hashClientIp(request);

    if (action === 'generate_backup_codes') {
      const plainCodes = generateBackupCodes(6);
      const hashes = [];
      for (const code of plainCodes) {
        hashes.push(await hashSecret(code));
      }
      await store.updateOwnerConfig({ backup_code_hashes: hashes });
      await store.logAudit({
        event_type: 'backup_codes_regenerated',
        ip_hash: ipHash,
        success: true,
      });
      return jsonResponse({
        success: true,
        backupCodes: plainCodes,
        message: 'Save these single-use backup recovery codes securely. They will not be shown again.',
      });
    }

    if (!isValidProfileId(profileId)) {
      return jsonResponse({ success: false, error: 'Invalid profile ID.' }, 400);
    }

    const current = await store.getProfileLock(profileId);
    const nextVersion = (current?.session_version || 1) + 1;

    if (action === 'set_password') {
      if (typeof password !== 'string' || password.trim().length < 6) {
        return jsonResponse(
          { success: false, error: 'Profile password must be at least 6 characters long.' },
          400
        );
      }

      const passwordHash = await hashSecret(password.trim());
      const shouldLock = isLocked !== undefined ? Boolean(isLocked) : true;

      const updated = await store.updateProfileLock(profileId, {
        is_locked: shouldLock,
        password_hash: passwordHash,
        session_version: nextVersion,
      });

      // Immediately invalidate all existing visitor sessions for ONLY this profile
      await store.revokeProfileSessions(profileId);
      await store.logAudit({
        event_type: 'profile_password_updated',
        profile_id: profileId,
        ip_hash: ipHash,
        success: true,
      });

      return jsonResponse({
        success: true,
        profile: {
          profileId,
          isLocked: Boolean(updated.is_locked && updated.password_hash),
          hasPassword: true,
          sessionVersion: updated.session_version,
        },
      });
    }

    if (action === 'toggle_lock') {
      const targetLocked = Boolean(isLocked);
      if (targetLocked && !current?.password_hash) {
        return jsonResponse(
          { success: false, error: 'Set a password for this profile before locking it.' },
          400
        );
      }

      const updated = await store.updateProfileLock(profileId, {
        is_locked: targetLocked,
        password_hash: current?.password_hash || null,
        session_version: targetLocked ? nextVersion : current?.session_version || 1,
      });

      if (targetLocked) {
        await store.revokeProfileSessions(profileId);
      }

      await store.logAudit({
        event_type: targetLocked ? 'profile_locked' : 'profile_unlocked',
        profile_id: profileId,
        ip_hash: ipHash,
        success: true,
      });

      return jsonResponse({
        success: true,
        profile: {
          profileId,
          isLocked: Boolean(updated.is_locked && updated.password_hash),
          hasPassword: Boolean(updated.password_hash),
          sessionVersion: updated.session_version,
        },
      });
    }

    if (action === 'remove_password') {
      const updated = await store.updateProfileLock(profileId, {
        is_locked: false,
        password_hash: null,
        session_version: nextVersion,
      });

      await store.revokeProfileSessions(profileId);
      await store.logAudit({
        event_type: 'profile_password_removed',
        profile_id: profileId,
        ip_hash: ipHash,
        success: true,
      });

      return jsonResponse({
        success: true,
        profile: {
          profileId,
          isLocked: false,
          hasPassword: false,
          sessionVersion: updated.session_version,
        },
      });
    }

    return jsonResponse({ success: false, error: 'Unsupported action.' }, 400);
  } catch (err) {
    console.error('[POST /api/owner/locks]', err);
    return jsonResponse({ success: false, error: 'Failed to update profile security settings.' }, 500);
  }
}
