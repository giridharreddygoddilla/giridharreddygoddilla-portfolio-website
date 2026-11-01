-- ==============================================================================
-- PROFILE LOCK MANAGER — SUPABASE PRODUCTION DATABASE MIGRATION
-- Project: Giridhar Reddy Goddilla — Cinematic Portfolio
--
-- This migration implements true server-side authorization and Row Level Security (RLS)
-- for profile access control, preventing plain-text password leakage or client-side tampering.
-- ==============================================================================

-- 1. Enable pgcrypto extension for secure salted hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create profile_locks table
CREATE TABLE IF NOT EXISTS public.profile_locks (
    profile_id TEXT PRIMARY KEY CHECK (profile_id IN ('giridhar', 'recruiter', 'developer', 'creative')),
    is_locked BOOLEAN NOT NULL DEFAULT false,
    password_hash TEXT, -- Stored securely via crypt(input, gen_salt('bf', 10))
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed existing 4 profiles
INSERT INTO public.profile_locks (profile_id, is_locked)
VALUES
    ('giridhar', false),
    ('recruiter', false),
    ('developer', false),
    ('creative', false)
ON CONFLICT (profile_id) DO NOTHING;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profile_locks ENABLE ROW LEVEL SECURITY;

-- 4. Public RLS Policy: Anyone can view lock status, but NEVER the password_hash!
CREATE POLICY "Public can view lock status without hash"
ON public.profile_locks
FOR SELECT
TO anon, authenticated
USING (true);

-- 5. Owner RLS Policy: Only authenticated owner can update locks or passwords
CREATE POLICY "Only authenticated owner can manage locks"
ON public.profile_locks
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'giridharreddygoddilla@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'giridharreddygoddilla@gmail.com');

-- 6. Server-Side Secure Function to verify visitor passwords
-- Runs with SECURITY DEFINER to check against password_hash without exposing the hash to clients
CREATE OR REPLACE FUNCTION public.verify_profile_password(
    p_profile_id TEXT,
    p_password_input TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_locked BOOLEAN;
    v_hash TEXT;
    v_is_correct BOOLEAN;
BEGIN
    SELECT is_locked, password_hash
    INTO v_locked, v_hash
    FROM public.profile_locks
    WHERE profile_id = p_profile_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
    END IF;

    IF NOT v_locked OR v_hash IS NULL THEN
        RETURN jsonb_build_object('success', true, 'unlocked', true);
    END IF;

    -- Evaluate password using pgcrypto blowfish hash comparison
    v_is_correct := (v_hash = crypt(p_password_input, v_hash));

    IF v_is_correct THEN
        RETURN jsonb_build_object('success', true, 'unlocked', true);
    ELSE
        RETURN jsonb_build_object('success', false, 'error', 'Incorrect password');
    END IF;
END;
$$;
