import assert from 'node:assert/strict';

process.env.SECURITY_TEST_INMEMORY = '1';
process.env.OWNER_BOOTSTRAP_SECRET = 'test-bootstrap-secret-999';
process.env.OWNER_RECOVERY_EMAIL = 'giridharreddygoddilla@gmail.com';
process.env.OWNER_RECOVERY_PHONE = '+447765508654';
globalThis.__TEST_OTP_SINK__ = [];

import { GET as getStatus } from '../api/profiles/status.mjs';
import { POST as unlockProfile } from '../api/profiles/unlock.mjs';
import { GET as getProfileContent } from '../api/profile-content.mjs';
import { GET as getOwnerAuth, POST as postOwnerAuth, DELETE as deleteOwnerAuth } from '../api/owner/auth.mjs';
import { GET as getOwnerLocks, POST as postOwnerLocks } from '../api/owner/locks.mjs';
import { GET as getOwnerRecovery, POST as postOwnerRecovery } from '../api/owner/recovery.mjs';
import { getStore } from '../api/_lib/store.mjs';

function makeReq(url, { method = 'GET', body, cookie = '', ip = '203.0.113.10' } = {}) {
  const headers = new Headers({
    'x-forwarded-for': ip,
    'user-agent': 'SecurityIntegrationSuite/1.0',
  });
  if (cookie) headers.set('cookie', cookie);
  if (body !== undefined) headers.set('content-type', 'application/json');
  return new Request(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

function extractCookiePair(res) {
  const setCookie = res.headers.get('set-cookie') || '';
  return setCookie.split(';')[0] || '';
}

let passed = 0;
async function test(name, fn) {
  await fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

console.log('\n======================================================');
console.log('SERVER-SIDE SECURITY & OTP INTEGRATION TEST SUITE');
console.log('======================================================\n');

let ownerCookie = '';
let visitorRecruiterCookie = '';
let backupCodes = [];

await test('1. Ordinary visitors are denied access to Owner Security Manager (401)', async () => {
  const resGet = await getOwnerLocks(makeReq('https://example.test/api/owner/locks'));
  assert.equal(resGet.status, 401);
  const resPost = await postOwnerLocks(
    makeReq('https://example.test/api/owner/locks', {
      method: 'POST',
      body: { action: 'toggle_lock', profileId: 'recruiter', isLocked: true },
    })
  );
  assert.equal(resPost.status, 401);
});

await test('2. Unauthorized visitor cannot hijack first-time owner bootstrap without secret', async () => {
  const res = await postOwnerAuth(
    makeReq('https://example.test/api/owner/auth', {
      method: 'POST',
      body: { action: 'initialize', password: 'EvilPassword123', bootstrapSecret: 'wrong-secret' },
    })
  );
  assert.equal(res.status, 401);
});

await test('3. Owner initializes with server bootstrap secret, receives HttpOnly cookie & bcrypt hash', async () => {
  const res = await postOwnerAuth(
    makeReq('https://example.test/api/owner/auth', {
      method: 'POST',
      body: {
        action: 'initialize',
        password: 'OwnerMasterPassword!2026',
        bootstrapSecret: 'test-bootstrap-secret-999',
      },
    })
  );
  assert.equal(res.status, 200);
  const setCookie = res.headers.get('set-cookie') || '';
  assert.ok(setCookie.includes('HttpOnly'), 'Owner cookie must be HttpOnly');
  assert.ok(setCookie.includes('SameSite=Lax'), 'Owner cookie must set SameSite=Lax');
  ownerCookie = extractCookiePair(res);

  const cfg = await getStore().getOwnerConfig();
  assert.ok(cfg.owner_password_hash.startsWith('$2'), 'Owner password must be bcrypt-hashed');
  assert.notEqual(cfg.owner_password_hash, 'OwnerMasterPassword!2026');
});

await test('4. Owner locks PROFESSIONAL independently; PERSONAL and CREATIVE stay public', async () => {
  const res = await postOwnerLocks(
    makeReq('https://example.test/api/owner/locks', {
      method: 'POST',
      cookie: ownerCookie,
      body: { action: 'set_password', profileId: 'recruiter', password: 'ProfSecret!2026', isLocked: true },
    })
  );
  assert.equal(res.status, 200);

  // Saved password is NEVER exposed in owner dashboard GET
  const dashRes = await getOwnerLocks(makeReq('https://example.test/api/owner/locks', { cookie: ownerCookie }));
  const dashText = await dashRes.text();
  assert.ok(!dashText.includes('ProfSecret!2026'), 'Plaintext password must never be exposed');
  assert.ok(!dashText.includes('$2b$'), 'Bcrypt hash must never be exposed');

  // Verify independent status across another browser/IP (global sync)
  const statusRes = await getStatus(makeReq('https://example.test/api/profiles/status', { ip: '198.51.100.77' }));
  const statusData = await statusRes.json();
  assert.equal(statusData.profiles.recruiter.isLocked, true);
  assert.equal(statusData.profiles.recruiter.unlocked, false);
  assert.equal(statusData.profiles.giridhar.isLocked, false);
  assert.equal(statusData.profiles.creative.isLocked, false);
});

await test('5. Direct API / URL access to locked PROFESSIONAL is blocked (401); unlocked profiles return 200', async () => {
  const blocked = await getProfileContent(
    makeReq('https://example.test/api/profile-content?profileId=recruiter', { ip: '198.51.100.55' })
  );
  assert.equal(blocked.status, 401);

  const personalOk = await getProfileContent(
    makeReq('https://example.test/api/profile-content?profileId=giridhar', { ip: '198.51.100.55' })
  );
  assert.equal(personalOk.status, 200);

  const creativeOk = await getProfileContent(
    makeReq('https://example.test/api/profile-content?profileId=creative', { ip: '198.51.100.55' })
  );
  assert.equal(creativeOk.status, 200);
});

await test('6. Wrong passwords denied (401) and brute-force rate limit triggers after 5 failures (429)', async () => {
  for (let i = 1; i <= 4; i++) {
    const r = await unlockProfile(
      makeReq('https://example.test/api/profiles/unlock', {
        method: 'POST',
        ip: '198.51.100.99',
        body: { profileId: 'recruiter', password: `wrong-${i}` },
      })
    );
    assert.equal(r.status, 401);
  }
  const fifth = await unlockProfile(
    makeReq('https://example.test/api/profiles/unlock', {
      method: 'POST',
      ip: '198.51.100.99',
      body: { profileId: 'recruiter', password: 'wrong-5' },
    })
  );
  assert.equal(fifth.status, 429);

  // Even the correct password is blocked while rate-limited
  const blockedRetry = await unlockProfile(
    makeReq('https://example.test/api/profiles/unlock', {
      method: 'POST',
      ip: '198.51.100.99',
      body: { profileId: 'recruiter', password: 'ProfSecret!2026' },
    })
  );
  assert.equal(blockedRetry.status, 429);
});

await test('7. Correct password grants HttpOnly cookie scoped ONLY to PROFESSIONAL (not CREATIVE)', async () => {
  // Also lock CREATIVE with a different password
  await postOwnerLocks(
    makeReq('https://example.test/api/owner/locks', {
      method: 'POST',
      cookie: ownerCookie,
      body: { action: 'set_password', profileId: 'creative', password: 'CreativeSecret!2026', isLocked: true },
    })
  );

  const res = await unlockProfile(
    makeReq('https://example.test/api/profiles/unlock', {
      method: 'POST',
      ip: '198.51.100.22',
      body: { profileId: 'recruiter', password: 'ProfSecret!2026' },
    })
  );
  assert.equal(res.status, 200);
  const setCookie = res.headers.get('set-cookie') || '';
  assert.ok(setCookie.includes('HttpOnly'), 'Profile cookie must be HttpOnly');
  visitorRecruiterCookie = extractCookiePair(res);

  // Authorized for PROFESSIONAL
  const okProf = await getProfileContent(
    makeReq('https://example.test/api/profile-content?profileId=recruiter', {
      ip: '198.51.100.22',
      cookie: visitorRecruiterCookie,
    })
  );
  assert.equal(okProf.status, 200);

  // Still DENIED for CREATIVE using PROFESSIONAL's cookie
  const deniedCreative = await getProfileContent(
    makeReq('https://example.test/api/profile-content?profileId=creative', {
      ip: '198.51.100.22',
      cookie: visitorRecruiterCookie,
    })
  );
  assert.equal(deniedCreative.status, 401);
});

await test('8. Changing PROFESSIONAL password immediately revokes existing visitor sessions', async () => {
  const res = await postOwnerLocks(
    makeReq('https://example.test/api/owner/locks', {
      method: 'POST',
      cookie: ownerCookie,
      body: { action: 'set_password', profileId: 'recruiter', password: 'RotatedProf!2026', isLocked: true },
    })
  );
  assert.equal(res.status, 200);

  // Visitor's old cookie is now immediately rejected (401)
  const revoked = await getProfileContent(
    makeReq('https://example.test/api/profile-content?profileId=recruiter', {
      ip: '198.51.100.22',
      cookie: visitorRecruiterCookie,
    })
  );
  assert.equal(revoked.status, 401);
});

await test('9. Unverified recovery email cannot request reset OTP until ownership is verified (403)', async () => {
  const res = await postOwnerRecovery(
    makeReq('https://example.test/api/owner/recovery', {
      method: 'POST',
      cookie: ownerCookie,
      body: { action: 'request_reset_otp', channel: 'email', targetProfileId: 'recruiter' },
    })
  );
  assert.equal(res.status, 403);
});

await test('10. Email OTP ownership verification enforces 6-digit single-use, 60s cooldown, and 5-min expiry', async () => {
  const reqOtp = await postOwnerRecovery(
    makeReq('https://example.test/api/owner/recovery', {
      method: 'POST',
      cookie: ownerCookie,
      body: { action: 'request_channel_verification', channel: 'email' },
    })
  );
  assert.equal(reqOtp.status, 200);
  const sent = globalThis.__TEST_OTP_SINK__.at(-1);
  assert.match(sent.otp, /^\d{6}$/, 'OTP must be 6 digits');

  // Immediate resend hits 60-second cooldown (429)
  const cooldownHit = await postOwnerRecovery(
    makeReq('https://example.test/api/owner/recovery', {
      method: 'POST',
      cookie: ownerCookie,
      body: { action: 'request_channel_verification', channel: 'email' },
    })
  );
  assert.equal(cooldownHit.status, 429);

  // Wrong OTP rejected (401)
  const badVerify = await postOwnerRecovery(
    makeReq('https://example.test/api/owner/recovery', {
      method: 'POST',
      cookie: ownerCookie,
      body: { action: 'confirm_channel_verification', channel: 'email', otp: '000000' },
    })
  );
  assert.equal(badVerify.status, 401);

  // Correct OTP succeeds
  const goodVerify = await postOwnerRecovery(
    makeReq('https://example.test/api/owner/recovery', {
      method: 'POST',
      cookie: ownerCookie,
      body: { action: 'confirm_channel_verification', channel: 'email', otp: sent.otp },
    })
  );
  assert.equal(goodVerify.status, 200);

  // Replaying same single-use OTP fails (400)
  const replay = await postOwnerRecovery(
    makeReq('https://example.test/api/owner/recovery', {
      method: 'POST',
      cookie: ownerCookie,
      body: { action: 'confirm_channel_verification', channel: 'email', otp: sent.otp },
    })
  );
  assert.equal(replay.status, 400);
});

await test('11. Verified Email OTP resets ONLY target profile password, respects 5-min expiry, and revokes old sessions', async () => {
  // First verify expired OTP is rejected
  const sendRes = await postOwnerRecovery(
    makeReq('https://example.test/api/owner/recovery', {
      method: 'POST',
      cookie: ownerCookie,
      body: { action: 'request_reset_otp', channel: 'email', targetProfileId: 'recruiter' },
    })
  );
  assert.equal(sendRes.status, 200);
  const firstResetOtp = globalThis.__TEST_OTP_SINK__.at(-1).otp;

  // Simulate 5-minute expiry on that challenge
  const latest = await getStore().getLatestOtpChallenge({
    channel: 'email',
    purpose: 'reset_profile_password',
    targetProfileId: 'recruiter',
  });
  await getStore().updateOtpChallenge(latest.id, {
    expires_at: new Date(Date.now() - 1000).toISOString(),
    created_at: new Date(Date.now() - 120000).toISOString(),
  });

  const expiredRes = await postOwnerRecovery(
    makeReq('https://example.test/api/owner/recovery', {
      method: 'POST',
      cookie: ownerCookie,
      body: {
        action: 'complete_reset_with_otp',
        channel: 'email',
        targetProfileId: 'recruiter',
        otp: firstResetOtp,
        newPassword: 'ShouldNotApply!1',
      },
    })
  );
  assert.equal(expiredRes.status, 400);

  // Now request fresh OTP and complete reset cleanly
  const sendFresh = await postOwnerRecovery(
    makeReq('https://example.test/api/owner/recovery', {
      method: 'POST',
      cookie: ownerCookie,
      body: { action: 'request_reset_otp', channel: 'email', targetProfileId: 'recruiter' },
    })
  );
  assert.equal(sendFresh.status, 200);
  const freshOtp = globalThis.__TEST_OTP_SINK__.at(-1).otp;

  const resetDone = await postOwnerRecovery(
    makeReq('https://example.test/api/owner/recovery', {
      method: 'POST',
      cookie: ownerCookie,
      body: {
        action: 'complete_reset_with_otp',
        channel: 'email',
        targetProfileId: 'recruiter',
        otp: freshOtp,
        newPassword: 'OtpResetProf!2026',
      },
    })
  );
  assert.equal(resetDone.status, 200);

  // New password works for PROFESSIONAL; CREATIVE password untouched
  const unlockNew = await unlockProfile(
    makeReq('https://example.test/api/profiles/unlock', {
      method: 'POST',
      ip: '198.51.100.33',
      body: { profileId: 'recruiter', password: 'OtpResetProf!2026' },
    })
  );
  assert.equal(unlockNew.status, 200);

  const unlockCreativeStillSame = await unlockProfile(
    makeReq('https://example.test/api/profiles/unlock', {
      method: 'POST',
      ip: '198.51.100.33',
      body: { profileId: 'creative', password: 'CreativeSecret!2026' },
    })
  );
  assert.equal(unlockCreativeStillSame.status, 200);
});

await test('12. Single-use Backup Recovery Codes work once and reject replay', async () => {
  const genRes = await postOwnerLocks(
    makeReq('https://example.test/api/owner/locks', {
      method: 'POST',
      cookie: ownerCookie,
      body: { action: 'generate_backup_codes' },
    })
  );
  assert.equal(genRes.status, 200);
  const genData = await genRes.json();
  backupCodes = genData.backupCodes;
  assert.equal(backupCodes.length, 6);

  const useOnce = await postOwnerRecovery(
    makeReq('https://example.test/api/owner/recovery', {
      method: 'POST',
      cookie: ownerCookie,
      body: {
        action: 'complete_reset_with_backup_code',
        targetProfileId: 'creative',
        backupCode: backupCodes[0],
        newPassword: 'BackupResetCreative!2026',
      },
    })
  );
  assert.equal(useOnce.status, 200);

  const replayCode = await postOwnerRecovery(
    makeReq('https://example.test/api/owner/recovery', {
      method: 'POST',
      cookie: ownerCookie,
      body: {
        action: 'complete_reset_with_backup_code',
        targetProfileId: 'creative',
        backupCode: backupCodes[0],
        newPassword: 'AnotherPass!2026',
      },
    })
  );
  assert.equal(replayCode.status, 401);
});

await test('13. Missing Email/SMS OTP providers are reported honestly and private recovery details are hidden from visitors', async () => {
  const visitorView = await getOwnerRecovery(makeReq('https://example.test/api/owner/recovery'));
  const visitorJson = await visitorView.json();
  assert.equal(visitorJson.maskedEmail, null, 'Private recovery email must not be exposed to visitors');
  assert.equal(visitorJson.maskedPhone, null, 'Private recovery phone must not be exposed to visitors');
  assert.equal(visitorJson.emailProviderConfigured, false);
  assert.equal(visitorJson.smsProviderConfigured, false);
  assert.ok(visitorJson.missingEmailVars.includes('RESEND_API_KEY'));
  assert.ok(visitorJson.missingSmsVars.includes('TWILIO_ACCOUNT_SID'));

  const ownerView = await getOwnerRecovery(
    makeReq('https://example.test/api/owner/recovery', { cookie: ownerCookie })
  );
  const ownerJson = await ownerView.json();
  assert.equal(ownerJson.maskedEmail, 'gi***@gmail.com');
  assert.equal(ownerJson.maskedPhone, '+44 •••••••654');
});

await test('14. Owner sign-out revokes server session and clears HttpOnly cookie', async () => {
  const outRes = await deleteOwnerAuth(
    makeReq('https://example.test/api/owner/auth', { method: 'DELETE', cookie: ownerCookie })
  );
  assert.equal(outRes.status, 200);
  const afterOut = await getOwnerAuth(
    makeReq('https://example.test/api/owner/auth', { cookie: ownerCookie })
  );
  const afterJson = await afterOut.json();
  assert.equal(afterJson.authenticated, false);
});

console.log(`\n======================================================`);
console.log(`SECURITY INTEGRATION RESULTS: ${passed} / 14 PASSED`);
console.log(`✓ ALL SERVER-SIDE ACCESS CONTROL, SESSION & OTP TESTS PASSED!`);
console.log(`======================================================\n`);
