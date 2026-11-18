-- ==============================================================================
-- PRODUCTION SERVER-SIDE PROFILE SECURITY, SESSIONS & OTP RECOVERY SCHEMA
-- Project: Giridhar Reddy Goddilla — The Journey
-- Profiles: giridhar (PERSONAL), recruiter (PROFESSIONAL), creative (CREATIVE)
--
-- Security Design:
--   - All sensitive tables have Row Level Security (RLS) enabled with ZERO anon
--     read/write access to password hashes, OTP hashes, session tokens, or recovery data.
--   - All mutations and verifications run server-side through Vercel Serverless Functions
--     using SUPABASE_SERVICE_ROLE_KEY (never exposed to browser code).
--   - Passwords, OTPs, and backup recovery codes are stored ONLY as bcrypt hashes ($2b$12$).
--   - Session revocation is enforced via `session_version` increments and `revoked_at`.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Individual Profile Lock Configuration (3 profiles only)
CREATE TABLE IF NOT EXISTS public.profile_locks (
  profile_id TEXT PRIMARY KEY CHECK (profile_id IN ('giridhar', 'recruiter', 'creative')),
  is_locked BOOLEAN NOT NULL DEFAULT false,
  password_hash TEXT,
  session_version INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Clean up any deprecated 'developer' row if upgrading an older schema
DELETE FROM public.profile_locks WHERE profile_id NOT IN ('giridhar', 'recruiter', 'creative');

INSERT INTO public.profile_locks (profile_id, is_locked, session_version)
VALUES
  ('giridhar', false, 1),
  ('recruiter', false, 1),
  ('creative', false, 1)
ON CONFLICT (profile_id) DO NOTHING;

-- 2. Owner Security Configuration (Singleton Row id = 1)
CREATE TABLE IF NOT EXISTS public.owner_security_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  owner_password_hash TEXT,
  recovery_email_verified BOOLEAN NOT NULL DEFAULT false,
  recovery_phone_verified BOOLEAN NOT NULL DEFAULT false,
  owner_session_version INTEGER NOT NULL DEFAULT 1,
  backup_code_hashes JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

INSERT INTO public.owner_security_config (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- 3. Server-Managed Sessions (HTTP-only cookie tokens stored ONLY as SHA-256 hashes)
CREATE TABLE IF NOT EXISTS public.security_sessions (
  token_hash TEXT PRIMARY KEY,
  session_type TEXT NOT NULL CHECK (session_type IN ('owner', 'profile')),
  profile_id TEXT CHECK (profile_id IS NULL OR profile_id IN ('giridhar', 'recruiter', 'creative')),
  session_version INTEGER NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_security_sessions_lookup
  ON public.security_sessions (session_type, profile_id, expires_at);

-- 4. Single-Use, 5-Minute Expiring OTP Challenges (bcrypt-hashed 6-digit codes)
CREATE TABLE IF NOT EXISTS public.otp_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
  purpose TEXT NOT NULL CHECK (purpose IN ('verify_email', 'verify_phone', 'reset_profile_password', 'owner_recovery')),
  target_profile_id TEXT CHECK (target_profile_id IS NULL OR target_profile_id IN ('giridhar', 'recruiter', 'creative')),
  otp_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_otp_challenges_active
  ON public.otp_challenges (channel, purpose, created_at DESC);

-- 5. Persistent Brute-Force Rate Limiter
CREATE TABLE IF NOT EXISTS public.rate_limits (
  bucket_key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  locked_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 6. Security Audit Log
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  profile_id TEXT,
  channel TEXT,
  ip_hash TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  detail TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ==============================================================================
-- STRICT ROW LEVEL SECURITY (RLS) — ZERO DIRECT CLIENT ACCESS
-- ==============================================================================
ALTER TABLE public.profile_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_security_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop any legacy permissive anon SELECT policies so hashes/config are never exposed
DROP POLICY IF EXISTS "Public can view lock status without hash" ON public.profile_locks;
DROP POLICY IF EXISTS "Only authenticated owner can manage locks" ON public.profile_locks;

-- Explicitly revoke direct client-role privileges; server functions use service_role
REVOKE ALL ON public.profile_locks FROM anon, authenticated;
REVOKE ALL ON public.owner_security_config FROM anon, authenticated;
REVOKE ALL ON public.security_sessions FROM anon, authenticated;
REVOKE ALL ON public.otp_challenges FROM anon, authenticated;
REVOKE ALL ON public.rate_limits FROM anon, authenticated;
REVOKE ALL ON public.security_audit_log FROM anon, authenticated;
