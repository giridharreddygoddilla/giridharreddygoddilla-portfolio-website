import {
  OWNER_COOKIE_NAME,
  parseCookies,
  profileCookieName,
  sha256Hex,
} from './crypto.mjs';

export async function verifyOwnerSession(request, store) {
  const cookies = parseCookies(request);
  const rawToken = cookies[OWNER_COOKIE_NAME];
  if (!rawToken) return { authenticated: false };

  const tokenHash = sha256Hex(rawToken);
  const session = await store.getSession(tokenHash);
  if (!session || session.session_type !== 'owner' || session.revoked_at) {
    return { authenticated: false };
  }

  if (new Date(session.expires_at).getTime() <= Date.now()) {
    return { authenticated: false };
  }

  const ownerConfig = await store.getOwnerConfig();
  if (session.session_version !== (ownerConfig.owner_session_version || 1)) {
    return { authenticated: false };
  }

  return { authenticated: true, tokenHash, session };
}

export async function verifyProfileAccess(request, store, profileId, lockRow) {
  // Unlocked profile opens normally without password
  if (!lockRow || !lockRow.is_locked || !lockRow.password_hash) {
    return { authorized: true, via: 'public' };
  }

  // Authenticated owner always has access
  const ownerCheck = await verifyOwnerSession(request, store);
  if (ownerCheck.authenticated) {
    return { authorized: true, via: 'owner' };
  }

  const cookies = parseCookies(request);
  const rawToken = cookies[profileCookieName(profileId)];
  if (!rawToken) {
    return { authorized: false };
  }

  const tokenHash = sha256Hex(rawToken);
  const session = await store.getSession(tokenHash);
  if (
    !session ||
    session.session_type !== 'profile' ||
    session.profile_id !== profileId ||
    session.revoked_at
  ) {
    return { authorized: false };
  }

  if (new Date(session.expires_at).getTime() <= Date.now()) {
    return { authorized: false };
  }

  // Enforces immediate session revocation whenever password changes or profile is locked
  if (session.session_version !== (lockRow.session_version || 1)) {
    return { authorized: false };
  }

  return { authorized: true, via: 'session', tokenHash };
}
