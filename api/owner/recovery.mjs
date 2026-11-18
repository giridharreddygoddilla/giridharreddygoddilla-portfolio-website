import {
  generateSixDigitOtp,
  hashClientIp,
  hashSecret,
  isValidProfileId,
  jsonResponse,
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
import {
  getRecoveryProviderStatus,
  sendEmailOtp,
  sendSmsOtp,
} from '../_lib/otpDelivery.mjs';

const OTP_TTL_MS = 5 * 60 * 1000; // Strictly 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60-second resend cooldown
const OTP_MAX_ATTEMPTS = 5;

function isValidChannel(channel) {
  return channel === 'email' || channel === 'sms';
}

export async function GET(request) {
  try {
    const providerStatus = getRecoveryProviderStatus();

    if (!isDatabaseConfigured()) {
      return jsonResponse({
        backendConfigured: false,
        missingDatabaseVars: getMissingDatabaseVars(),
        emailProviderConfigured: providerStatus.emailConfigured,
        smsProviderConfigured: providerStatus.smsConfigured,
        missingEmailVars: providerStatus.missingEmailVars,
        missingSmsVars: providerStatus.missingSmsVars,
      });
    }

    const store = getStore();
    const owner = await verifyOwnerSession(request, store);
    const ownerConfig = await store.getOwnerConfig();

    // Only expose masked destinations to authenticated owner; ordinary visitors never see private recovery info
    return jsonResponse({
      backendConfigured: true,
      authenticated: owner.authenticated,
      emailVerified: Boolean(ownerConfig.recovery_email_verified),
      phoneVerified: Boolean(ownerConfig.recovery_phone_verified),
      maskedEmail: owner.authenticated ? providerStatus.maskedEmail : null,
      maskedPhone: owner.authenticated ? providerStatus.maskedPhone : null,
      emailProviderConfigured: providerStatus.emailConfigured,
      smsProviderConfigured: providerStatus.smsConfigured,
      missingEmailVars: providerStatus.missingEmailVars,
      missingSmsVars: providerStatus.missingSmsVars,
      backupCodesAvailable:
        Array.isArray(ownerConfig.backup_code_hashes) &&
        ownerConfig.backup_code_hashes.length > 0,
    });
  } catch (err) {
    console.error('[GET /api/owner/recovery]', err);
    return jsonResponse({ error: 'Unable to load recovery status.' }, 500);
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

    const { action, channel, targetProfileId, otp, newPassword, backupCode } = body || {};
    const store = getStore();
    const ipHash = hashClientIp(request);

    // 1. REQUEST OWNERSHIP VERIFICATION OTP (Owner-only)
    if (action === 'request_channel_verification') {
      const owner = await verifyOwnerSession(request, store);
      if (!owner.authenticated) {
        return jsonResponse({ success: false, error: 'Owner authentication required.' }, 401);
      }
      if (!isValidChannel(channel)) {
        return jsonResponse({ success: false, error: 'Channel must be email or sms.' }, 400);
      }

      const purpose = channel === 'email' ? 'verify_email' : 'verify_phone';
      const sendLimit = await checkRateLimit(store, `otp_send:${channel}:${ipHash}`, {
        maxAttempts: 5,
        windowMs: 60 * 60 * 1000,
        lockoutMs: 15 * 60 * 1000,
      });
      if (!sendLimit.allowed) {
        return jsonResponse(
          {
            success: false,
            error: `OTP request limit reached. Try again in ${sendLimit.retryAfterSeconds}s.`,
            cooldownSeconds: sendLimit.retryAfterSeconds,
          },
          429
        );
      }

      const latest = await store.getLatestOtpChallenge({ channel, purpose });
      if (latest) {
        const elapsed = Date.now() - new Date(latest.created_at).getTime();
        if (elapsed < RESEND_COOLDOWN_MS) {
          const waitSec = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
          return jsonResponse(
            {
              success: false,
              error: `Please wait ${waitSec}s before requesting another code.`,
              cooldownSeconds: waitSec,
            },
            429
          );
        }
      }

      const plainOtp = generateSixDigitOtp();
      const purposeLabel =
        channel === 'email' ? 'Verify Recovery Email Ownership' : 'Verify Recovery Phone Ownership';
      const delivery =
        channel === 'email'
          ? await sendEmailOtp({ otp: plainOtp, purposeLabel })
          : await sendSmsOtp({ otp: plainOtp, purposeLabel });

      if (!delivery.delivered) {
        return jsonResponse(
          {
            success: false,
            providerConfigured: false,
            error: delivery.error,
            missingVars: delivery.missingVars,
          },
          503
        );
      }

      const otpHash = await hashSecret(plainOtp);
      await store.createOtpChallenge({
        channel,
        purpose,
        target_profile_id: null,
        otp_hash: otpHash,
        attempts: 0,
        max_attempts: OTP_MAX_ATTEMPTS,
        expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
      });
      await recordFailedAttempt(store, `otp_send:${channel}:${ipHash}`, {
        maxAttempts: 5,
        windowMs: 60 * 60 * 1000,
        lockoutMs: 15 * 60 * 1000,
      });
      await store.logAudit({
        event_type: 'otp_channel_verification_sent',
        channel,
        ip_hash: ipHash,
        success: true,
      });

      return jsonResponse({
        success: true,
        expiresInSeconds: 300,
        cooldownSeconds: 60,
        message: `A 6-digit single-use verification code was sent via ${channel.toUpperCase()}. It expires in 5 minutes.`,
      });
    }

    // 2. CONFIRM OWNERSHIP VERIFICATION OTP (Owner-only)
    if (action === 'confirm_channel_verification') {
      const owner = await verifyOwnerSession(request, store);
      if (!owner.authenticated) {
        return jsonResponse({ success: false, error: 'Owner authentication required.' }, 401);
      }
      if (!isValidChannel(channel) || typeof otp !== 'string' || !/^\d{6}$/.test(otp.trim())) {
        return jsonResponse({ success: false, error: 'Enter a valid 6-digit OTP code.' }, 400);
      }

      const purpose = channel === 'email' ? 'verify_email' : 'verify_phone';
      const challenge = await store.getLatestOtpChallenge({ channel, purpose });
      const check = await evaluateOtpChallenge(store, challenge, otp.trim());
      if (!check.valid) {
        await store.logAudit({
          event_type: 'otp_channel_verification_failed',
          channel,
          ip_hash: ipHash,
          success: false,
        });
        return jsonResponse({ success: false, error: check.error }, check.status);
      }

      // Mark OTP single-use consumed + mark channel verified
      await store.updateOtpChallenge(challenge.id, { used_at: new Date().toISOString() });
      await store.updateOwnerConfig(
        channel === 'email'
          ? { recovery_email_verified: true }
          : { recovery_phone_verified: true }
      );
      await store.logAudit({
        event_type: 'otp_channel_verified',
        channel,
        ip_hash: ipHash,
        success: true,
      });

      return jsonResponse({
        success: true,
        verified: true,
        channel,
        message: `Recovery ${channel} ownership verified and enabled for password recovery.`,
      });
    }

    // 3. REQUEST PASSWORD RESET OTP (Requires verified channel; profile reset requires owner session)
    if (action === 'request_reset_otp') {
      if (!isValidChannel(channel)) {
        return jsonResponse({ success: false, error: 'Channel must be email or sms.' }, 400);
      }

      const isOwnerRecovery = targetProfileId === 'owner';
      if (!isOwnerRecovery && !isValidProfileId(targetProfileId)) {
        return jsonResponse({ success: false, error: 'Invalid target profile.' }, 400);
      }

      // Individual profile password reset via OTP is strictly owner-only
      if (!isOwnerRecovery) {
        const owner = await verifyOwnerSession(request, store);
        if (!owner.authenticated) {
          return jsonResponse({ success: false, error: 'Owner authentication required.' }, 401);
        }
      }

      const ownerConfig = await store.getOwnerConfig();
      const channelVerified =
        channel === 'email'
          ? Boolean(ownerConfig.recovery_email_verified)
          : Boolean(ownerConfig.recovery_phone_verified);

      if (!channelVerified) {
        return jsonResponse(
          {
            success: false,
            error: `Recovery ${channel} must be verified by the owner before it can be used for OTP recovery.`,
          },
          403
        );
      }

      const sendLimit = await checkRateLimit(store, `otp_reset_send:${channel}:${ipHash}`, {
        maxAttempts: 5,
        windowMs: 60 * 60 * 1000,
        lockoutMs: 15 * 60 * 1000,
      });
      if (!sendLimit.allowed) {
        return jsonResponse(
          {
            success: false,
            error: `Too many OTP requests. Please wait ${sendLimit.retryAfterSeconds}s.`,
            cooldownSeconds: sendLimit.retryAfterSeconds,
          },
          429
        );
      }

      const purpose = isOwnerRecovery ? 'owner_recovery' : 'reset_profile_password';
      const targetId = isOwnerRecovery ? null : targetProfileId;
      const latest = await store.getLatestOtpChallenge({
        channel,
        purpose,
        targetProfileId: targetId,
      });

      if (latest) {
        const elapsed = Date.now() - new Date(latest.created_at).getTime();
        if (elapsed < RESEND_COOLDOWN_MS) {
          const waitSec = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
          return jsonResponse(
            {
              success: false,
              error: `Please wait ${waitSec}s before requesting a new OTP.`,
              cooldownSeconds: waitSec,
            },
            429
          );
        }
      }

      const plainOtp = generateSixDigitOtp();
      const purposeLabel = isOwnerRecovery
        ? 'Owner Account Password Recovery'
        : `Reset ${targetProfileId.toUpperCase()} Profile Password`;

      const delivery =
        channel === 'email'
          ? await sendEmailOtp({ otp: plainOtp, purposeLabel })
          : await sendSmsOtp({ otp: plainOtp, purposeLabel });

      if (!delivery.delivered) {
        return jsonResponse(
          {
            success: false,
            providerConfigured: false,
            error: delivery.error,
            missingVars: delivery.missingVars,
          },
          503
        );
      }

      const otpHash = await hashSecret(plainOtp);
      await store.createOtpChallenge({
        channel,
        purpose,
        target_profile_id: targetId,
        otp_hash: otpHash,
        attempts: 0,
        max_attempts: OTP_MAX_ATTEMPTS,
        expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
      });
      await recordFailedAttempt(store, `otp_reset_send:${channel}:${ipHash}`, {
        maxAttempts: 5,
        windowMs: 60 * 60 * 1000,
        lockoutMs: 15 * 60 * 1000,
      });
      await store.logAudit({
        event_type: 'otp_reset_sent',
        profile_id: targetId,
        channel,
        ip_hash: ipHash,
        success: true,
      });

      return jsonResponse({
        success: true,
        expiresInSeconds: 300,
        cooldownSeconds: 60,
        message: `A 6-digit single-use recovery code was sent via ${channel.toUpperCase()}. It expires in 5 minutes.`,
      });
    }

    // 4. COMPLETE PASSWORD RESET WITH OTP (Atomic verify + reset; never exposes separate OTP probe endpoint)
    if (action === 'complete_reset_with_otp') {
      if (!isValidChannel(channel) || typeof otp !== 'string' || !/^\d{6}$/.test(otp.trim())) {
        return jsonResponse({ success: false, error: 'Enter a valid 6-digit OTP code.' }, 400);
      }

      const isOwnerRecovery = targetProfileId === 'owner';
      if (!isOwnerRecovery && !isValidProfileId(targetProfileId)) {
        return jsonResponse({ success: false, error: 'Invalid target profile.' }, 400);
      }

      const minLen = isOwnerRecovery ? 8 : 6;
      if (typeof newPassword !== 'string' || newPassword.trim().length < minLen) {
        return jsonResponse(
          { success: false, error: `New password must be at least ${minLen} characters long.` },
          400
        );
      }

      if (!isOwnerRecovery) {
        const owner = await verifyOwnerSession(request, store);
        if (!owner.authenticated) {
          return jsonResponse({ success: false, error: 'Owner authentication required.' }, 401);
        }
      }

      const verifyLimit = await checkRateLimit(store, `otp_verify:${ipHash}`, {
        maxAttempts: 10,
        windowMs: 15 * 60 * 1000,
        lockoutMs: 10 * 60 * 1000,
      });
      if (!verifyLimit.allowed) {
        return jsonResponse(
          {
            success: false,
            error: `Too many failed verification attempts. Wait ${verifyLimit.retryAfterSeconds}s.`,
          },
          429
        );
      }

      const purpose = isOwnerRecovery ? 'owner_recovery' : 'reset_profile_password';
      const targetId = isOwnerRecovery ? null : targetProfileId;
      const challenge = await store.getLatestOtpChallenge({
        channel,
        purpose,
        targetProfileId: targetId,
      });

      const check = await evaluateOtpChallenge(store, challenge, otp.trim());
      if (!check.valid) {
        await recordFailedAttempt(store, `otp_verify:${ipHash}`, {
          maxAttempts: 10,
          windowMs: 15 * 60 * 1000,
          lockoutMs: 10 * 60 * 1000,
        });
        await store.logAudit({
          event_type: 'otp_reset_failed',
          profile_id: targetId,
          channel,
          ip_hash: ipHash,
          success: false,
        });
        return jsonResponse({ success: false, error: check.error }, check.status);
      }

      // Atomically mark OTP used (single-use)
      await store.updateOtpChallenge(challenge.id, { used_at: new Date().toISOString() });
      await clearRateLimit(store, `otp_verify:${ipHash}`);

      const hashed = await hashSecret(newPassword.trim());
      if (isOwnerRecovery) {
        const cfg = await store.getOwnerConfig();
        await store.updateOwnerConfig({
          owner_password_hash: hashed,
          owner_session_version: (cfg.owner_session_version || 1) + 1,
        });
        await store.revokeAllOwnerSessions();
      } else {
        const current = await store.getProfileLock(targetProfileId);
        await store.updateProfileLock(targetProfileId, {
          is_locked: true,
          password_hash: hashed,
          session_version: (current?.session_version || 1) + 1,
        });
        // Revoke ONLY this profile's sessions without affecting other profiles
        await store.revokeProfileSessions(targetProfileId);
      }

      await store.logAudit({
        event_type: 'otp_reset_completed',
        profile_id: targetId,
        channel,
        ip_hash: ipHash,
        success: true,
      });

      return jsonResponse({
        success: true,
        message: isOwnerRecovery
          ? 'Owner password reset successfully. All previous owner sessions were revoked.'
          : 'Profile password reset successfully. Existing visitor sessions for this profile were revoked.',
      });
    }

    // 5. COMPLETE RESET WITH SINGLE-USE BACKUP RECOVERY CODE
    if (action === 'complete_reset_with_backup_code') {
      const isOwnerRecovery = targetProfileId === 'owner';
      if (!isOwnerRecovery && !isValidProfileId(targetProfileId)) {
        return jsonResponse({ success: false, error: 'Invalid target profile.' }, 400);
      }
      if (typeof backupCode !== 'string' || !backupCode.trim()) {
        return jsonResponse({ success: false, error: 'Enter a valid backup recovery code.' }, 400);
      }
      const minLen = isOwnerRecovery ? 8 : 6;
      if (typeof newPassword !== 'string' || newPassword.trim().length < minLen) {
        return jsonResponse(
          { success: false, error: `New password must be at least ${minLen} characters long.` },
          400
        );
      }
      if (!isOwnerRecovery) {
        const owner = await verifyOwnerSession(request, store);
        if (!owner.authenticated) {
          return jsonResponse({ success: false, error: 'Owner authentication required.' }, 401);
        }
      }

      const limit = await checkRateLimit(store, `backup_code:${ipHash}`, {
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000,
        lockoutMs: 10 * 60 * 1000,
      });
      if (!limit.allowed) {
        return jsonResponse(
          { success: false, error: `Too many failed attempts. Wait ${limit.retryAfterSeconds}s.` },
          429
        );
      }

      const cfg = await store.getOwnerConfig();
      const hashes = Array.isArray(cfg.backup_code_hashes) ? cfg.backup_code_hashes : [];
      const normalized = backupCode.trim().toUpperCase();

      let matchedIndex = -1;
      for (let i = 0; i < hashes.length; i++) {
        if (await verifySecret(normalized, hashes[i])) {
          matchedIndex = i;
          break;
        }
      }

      if (matchedIndex === -1) {
        await recordFailedAttempt(store, `backup_code:${ipHash}`, {
          maxAttempts: 5,
          windowMs: 15 * 60 * 1000,
          lockoutMs: 10 * 60 * 1000,
        });
        await store.logAudit({
          event_type: 'backup_code_failed',
          profile_id: isOwnerRecovery ? null : targetProfileId,
          ip_hash: ipHash,
          success: false,
        });
        return jsonResponse({ success: false, error: 'Invalid or already used backup recovery code.' }, 401);
      }

      // Consume the single-use backup code
      const remainingHashes = hashes.filter((_, idx) => idx !== matchedIndex);
      const hashed = await hashSecret(newPassword.trim());

      if (isOwnerRecovery) {
        await store.updateOwnerConfig({
          owner_password_hash: hashed,
          owner_session_version: (cfg.owner_session_version || 1) + 1,
          backup_code_hashes: remainingHashes,
        });
        await store.revokeAllOwnerSessions();
      } else {
        await store.updateOwnerConfig({ backup_code_hashes: remainingHashes });
        const current = await store.getProfileLock(targetProfileId);
        await store.updateProfileLock(targetProfileId, {
          is_locked: true,
          password_hash: hashed,
          session_version: (current?.session_version || 1) + 1,
        });
        await store.revokeProfileSessions(targetProfileId);
      }

      await clearRateLimit(store, `backup_code:${ipHash}`);
      await store.logAudit({
        event_type: 'backup_code_reset_completed',
        profile_id: isOwnerRecovery ? null : targetProfileId,
        ip_hash: ipHash,
        success: true,
      });

      return jsonResponse({
        success: true,
        backupCodesRemaining: remainingHashes.length,
        message: 'Recovery code accepted. Password updated and old sessions revoked.',
      });
    }

    return jsonResponse({ success: false, error: 'Unsupported recovery action.' }, 400);
  } catch (err) {
    console.error('[POST /api/owner/recovery]', err);
    return jsonResponse({ success: false, error: 'Recovery request failed.' }, 500);
  }
}

async function evaluateOtpChallenge(store, challenge, plainOtp) {
  if (!challenge) {
    return { valid: false, status: 400, error: 'No active OTP challenge found. Request a new code.' };
  }
  if (challenge.used_at) {
    return { valid: false, status: 400, error: 'This OTP code has already been used. Request a new code.' };
  }
  if (new Date(challenge.expires_at).getTime() <= Date.now()) {
    return { valid: false, status: 400, error: 'This OTP code has expired (5-minute limit). Request a new code.' };
  }
  const attempts = challenge.attempts || 0;
  const maxAttempts = challenge.max_attempts || OTP_MAX_ATTEMPTS;
  if (attempts >= maxAttempts) {
    return { valid: false, status: 429, error: 'Maximum OTP attempts exceeded. Request a new code.' };
  }

  const matched = await verifySecret(plainOtp, challenge.otp_hash);
  if (!matched) {
    const nextAttempts = attempts + 1;
    await store.updateOtpChallenge(challenge.id, { attempts: nextAttempts });
    const left = Math.max(0, maxAttempts - nextAttempts);
    return {
      valid: false,
      status: left === 0 ? 429 : 401,
      error:
        left === 0
          ? 'Maximum OTP attempts exceeded. Request a new code.'
          : `Invalid OTP code. ${left} attempt${left === 1 ? '' : 's'} remaining.`,
    };
  }

  return { valid: true };
}
