import crypto from 'crypto';
import { VALID_PROFILES } from './crypto.mjs';

export function isDatabaseConfigured() {
  if (process.env.SECURITY_TEST_INMEMORY === '1') return true;
  return Boolean(
    (process.env.SUPABASE_URL || '').trim() &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  );
}

export function getMissingDatabaseVars() {
  const missing = [];
  if (!(process.env.SUPABASE_URL || '').trim()) missing.push('SUPABASE_URL');
  if (!(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  return missing;
}

// Isolated in-memory adapter — ONLY active when SECURITY_TEST_INMEMORY=1 for automated integration tests
function getTestDb() {
  if (!globalThis.__SECURITY_TEST_DB__) {
    const now = new Date().toISOString();
    globalThis.__SECURITY_TEST_DB__ = {
      profile_locks: new Map(
        VALID_PROFILES.map((id) => [
          id,
          { profile_id: id, is_locked: false, password_hash: null, session_version: 1, updated_at: now },
        ])
      ),
      owner_security_config: {
        id: 1,
        owner_password_hash: null,
        recovery_email_verified: false,
        recovery_phone_verified: false,
        owner_session_version: 1,
        backup_code_hashes: [],
        updated_at: now,
      },
      security_sessions: new Map(),
      otp_challenges: [],
      rate_limits: new Map(),
      security_audit_log: [],
    };
  }
  return globalThis.__SECURITY_TEST_DB__;
}

function createInMemoryStore() {
  const db = getTestDb();
  return {
    async listProfileLocks() {
      return VALID_PROFILES.map((id) => ({ ...db.profile_locks.get(id) }));
    },
    async getProfileLock(profileId) {
      const row = db.profile_locks.get(profileId);
      return row ? { ...row } : null;
    },
    async updateProfileLock(profileId, patch) {
      const current = db.profile_locks.get(profileId) || {
        profile_id: profileId,
        is_locked: false,
        password_hash: null,
        session_version: 1,
      };
      const updated = { ...current, ...patch, updated_at: new Date().toISOString() };
      db.profile_locks.set(profileId, updated);
      return { ...updated };
    },
    async getOwnerConfig() {
      return { ...db.owner_security_config };
    },
    async updateOwnerConfig(patch) {
      db.owner_security_config = {
        ...db.owner_security_config,
        ...patch,
        updated_at: new Date().toISOString(),
      };
      return { ...db.owner_security_config };
    },
    async createSession(session) {
      const row = { ...session, revoked_at: null, created_at: new Date().toISOString() };
      db.security_sessions.set(session.token_hash, row);
      return row;
    },
    async getSession(tokenHash) {
      const row = db.security_sessions.get(tokenHash);
      return row ? { ...row } : null;
    },
    async revokeSession(tokenHash) {
      const row = db.security_sessions.get(tokenHash);
      if (row) {
        row.revoked_at = new Date().toISOString();
        db.security_sessions.set(tokenHash, row);
      }
    },
    async revokeProfileSessions(profileId) {
      const now = new Date().toISOString();
      for (const [k, row] of db.security_sessions.entries()) {
        if (row.session_type === 'profile' && row.profile_id === profileId && !row.revoked_at) {
          row.revoked_at = now;
          db.security_sessions.set(k, row);
        }
      }
    },
    async revokeAllOwnerSessions() {
      const now = new Date().toISOString();
      for (const [k, row] of db.security_sessions.entries()) {
        if (row.session_type === 'owner' && !row.revoked_at) {
          row.revoked_at = now;
          db.security_sessions.set(k, row);
        }
      }
    },
    async createOtpChallenge(challenge) {
      const row = {
        id: crypto.randomUUID(),
        attempts: 0,
        max_attempts: 5,
        used_at: null,
        created_at: new Date().toISOString(),
        ...challenge,
      };
      db.otp_challenges.push(row);
      return { ...row };
    },
    async getLatestOtpChallenge({ channel, purpose, targetProfileId = null }) {
      const matches = db.otp_challenges
        .filter(
          (c) =>
            c.channel === channel &&
            c.purpose === purpose &&
            (targetProfileId === null || c.target_profile_id === targetProfileId)
        )
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return matches[0] ? { ...matches[0] } : null;
    },
    async updateOtpChallenge(id, patch) {
      const idx = db.otp_challenges.findIndex((c) => c.id === id);
      if (idx === -1) return null;
      db.otp_challenges[idx] = { ...db.otp_challenges[idx], ...patch };
      return { ...db.otp_challenges[idx] };
    },
    async getRateLimit(bucketKey) {
      const row = db.rate_limits.get(bucketKey);
      return row ? { ...row } : null;
    },
    async upsertRateLimit(entry) {
      const row = { ...entry, updated_at: new Date().toISOString() };
      db.rate_limits.set(entry.bucket_key, row);
      return row;
    },
    async resetRateLimit(bucketKey) {
      db.rate_limits.delete(bucketKey);
    },
    async logAudit(event) {
      db.security_audit_log.push({ ...event, created_at: new Date().toISOString() });
    },
    async getRecentAudit(limit = 10) {
      return db.security_audit_log.slice(-limit).reverse();
    },
  };
}

// Production Supabase PostgreSQL REST Store (service_role server-side only)
function createSupabaseStore() {
  const baseUrl = process.env.SUPABASE_URL.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY.trim();

  async function sbFetch(pathAndQuery, { method = 'GET', body, prefer } = {}) {
    const headers = {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    };
    if (prefer) headers.Prefer = prefer;

    const res = await fetch(`${baseUrl}/rest/v1/${pathAndQuery}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Supabase REST error (${res.status}): ${text}`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  return {
    async listProfileLocks() {
      const rows = await sbFetch('profile_locks?select=profile_id,is_locked,password_hash,session_version,updated_at&order=profile_id.asc');
      const map = new Map((rows || []).map((r) => [r.profile_id, r]));
      return VALID_PROFILES.map(
        (id) =>
          map.get(id) || {
            profile_id: id,
            is_locked: false,
            password_hash: null,
            session_version: 1,
            updated_at: new Date().toISOString(),
          }
      );
    },
    async getProfileLock(profileId) {
      const rows = await sbFetch(
        `profile_locks?profile_id=eq.${encodeURIComponent(profileId)}&select=profile_id,is_locked,password_hash,session_version,updated_at&limit=1`
      );
      return rows?.[0] || null;
    },
    async updateProfileLock(profileId, patch) {
      const rows = await sbFetch('profile_locks', {
        method: 'POST',
        prefer: 'resolution=merge-duplicates,return=representation',
        body: {
          profile_id: profileId,
          ...patch,
          updated_at: new Date().toISOString(),
        },
      });
      return rows?.[0] || null;
    },
    async getOwnerConfig() {
      const rows = await sbFetch(
        'owner_security_config?id=eq.1&select=id,owner_password_hash,recovery_email_verified,recovery_phone_verified,owner_session_version,backup_code_hashes,updated_at&limit=1'
      );
      return (
        rows?.[0] || {
          id: 1,
          owner_password_hash: null,
          recovery_email_verified: false,
          recovery_phone_verified: false,
          owner_session_version: 1,
          backup_code_hashes: [],
          updated_at: new Date().toISOString(),
        }
      );
    },
    async updateOwnerConfig(patch) {
      const rows = await sbFetch('owner_security_config', {
        method: 'POST',
        prefer: 'resolution=merge-duplicates,return=representation',
        body: {
          id: 1,
          ...patch,
          updated_at: new Date().toISOString(),
        },
      });
      return rows?.[0] || null;
    },
    async createSession(session) {
      const rows = await sbFetch('security_sessions', {
        method: 'POST',
        prefer: 'return=representation',
        body: session,
      });
      return rows?.[0] || null;
    },
    async getSession(tokenHash) {
      const rows = await sbFetch(
        `security_sessions?token_hash=eq.${encodeURIComponent(tokenHash)}&select=*&limit=1`
      );
      return rows?.[0] || null;
    },
    async revokeSession(tokenHash) {
      await sbFetch(`security_sessions?token_hash=eq.${encodeURIComponent(tokenHash)}`, {
        method: 'PATCH',
        body: { revoked_at: new Date().toISOString() },
      });
    },
    async revokeProfileSessions(profileId) {
      await sbFetch(
        `security_sessions?session_type=eq.profile&profile_id=eq.${encodeURIComponent(profileId)}&revoked_at=is.null`,
        {
          method: 'PATCH',
          body: { revoked_at: new Date().toISOString() },
        }
      );
    },
    async revokeAllOwnerSessions() {
      await sbFetch('security_sessions?session_type=eq.owner&revoked_at=is.null', {
        method: 'PATCH',
        body: { revoked_at: new Date().toISOString() },
      });
    },
    async createOtpChallenge(challenge) {
      const rows = await sbFetch('otp_challenges', {
        method: 'POST',
        prefer: 'return=representation',
        body: challenge,
      });
      return rows?.[0] || null;
    },
    async getLatestOtpChallenge({ channel, purpose, targetProfileId = null }) {
      let query = `otp_challenges?channel=eq.${encodeURIComponent(channel)}&purpose=eq.${encodeURIComponent(purpose)}&order=created_at.desc&limit=1`;
      if (targetProfileId !== null) {
        query += `&target_profile_id=eq.${encodeURIComponent(targetProfileId)}`;
      }
      const rows = await sbFetch(query);
      return rows?.[0] || null;
    },
    async updateOtpChallenge(id, patch) {
      const rows = await sbFetch(`otp_challenges?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        prefer: 'return=representation',
        body: patch,
      });
      return rows?.[0] || null;
    },
    async getRateLimit(bucketKey) {
      const rows = await sbFetch(
        `rate_limits?bucket_key=eq.${encodeURIComponent(bucketKey)}&select=*&limit=1`
      );
      return rows?.[0] || null;
    },
    async upsertRateLimit(entry) {
      await sbFetch('rate_limits', {
        method: 'POST',
        prefer: 'resolution=merge-duplicates',
        body: { ...entry, updated_at: new Date().toISOString() },
      });
    },
    async resetRateLimit(bucketKey) {
      await sbFetch(`rate_limits?bucket_key=eq.${encodeURIComponent(bucketKey)}`, {
        method: 'DELETE',
      });
    },
    async logAudit(event) {
      try {
        await sbFetch('security_audit_log', { method: 'POST', body: event });
      } catch (err) {
        console.error('[Audit Log Warning]', err.message);
      }
    },
    async getRecentAudit(limit = 10) {
      try {
        return (
          (await sbFetch(
            `security_audit_log?select=event_type,profile_id,channel,success,detail,created_at&order=created_at.desc&limit=${limit}`
          )) || []
        );
      } catch {
        return [];
      }
    },
  };
}

export function getStore() {
  if (process.env.SECURITY_TEST_INMEMORY === '1') {
    return createInMemoryStore();
  }
  if (!isDatabaseConfigured()) {
    return null;
  }
  return createSupabaseStore();
}
