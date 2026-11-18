import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const VALID_PROFILES = ['giridhar', 'recruiter', 'creative'];
export const BCRYPT_ROUNDS = 12;
export const OWNER_COOKIE_NAME = 'ggr_owner_sess';
export const PROFILE_COOKIE_PREFIX = 'ggr_profile_sess_';

export function isValidProfileId(id) {
  return typeof id === 'string' && VALID_PROFILES.includes(id);
}

export async function hashSecret(plain) {
  return bcrypt.hash(String(plain), BCRYPT_ROUNDS);
}

export async function verifySecret(plain, hash) {
  if (!plain || !hash) return false;
  return bcrypt.compare(String(plain), String(hash));
}

export function generateSessionToken() {
  const token = crypto.randomBytes(32).toString('base64url');
  const tokenHash = sha256Hex(token);
  return { token, tokenHash };
}

export function sha256Hex(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

export function generateSixDigitOtp() {
  const n = crypto.randomInt(0, 1000000);
  return String(n).padStart(6, '0');
}

export function generateBackupCodes(count = 6) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const partA = crypto.randomBytes(2).toString('hex').toUpperCase();
    const partB = crypto.randomBytes(2).toString('hex').toUpperCase();
    codes.push(`${partA}-${partB}`);
  }
  return codes;
}

export function hashClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for') || '';
  const realIp = request.headers.get('x-real-ip') || '';
  const ip = (forwarded.split(',')[0] || realIp || 'unknown').trim();
  const pepper = process.env.SECURITY_IP_PEPPER || 'ggr-default-ip-pepper';
  return sha256Hex(`${pepper}:${ip}`).slice(0, 32);
}

export function parseCookies(request) {
  const header = request.headers.get('cookie') || '';
  const map = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) map[key] = decodeURIComponent(val);
  }
  return map;
}

export function serializeCookie(name, value, maxAgeSeconds) {
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`,
  ];
  if (isProd) parts.push('Secure');
  return parts.join('; ');
}

export function clearCookieHeader(name) {
  return serializeCookie(name, '', 0);
}

export function profileCookieName(profileId) {
  return `${PROFILE_COOKIE_PREFIX}${profileId}`;
}

export function maskEmail(email) {
  if (!email || !email.includes('@')) return null;
  const [local, domain] = email.split('@');
  const head = local.slice(0, Math.min(2, local.length));
  return `${head}***@${domain}`;
}

export function maskPhone(phone) {
  if (!phone) return null;
  const clean = phone.replace(/\s+/g, '');
  if (clean.length < 6) return '***';
  return `${clean.slice(0, 3)} •••••••${clean.slice(-3)}`;
}

export function jsonResponse(body, status = 200, extraHeaders = {}) {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    ...extraHeaders,
  });
  return new Response(JSON.stringify(body), { status, headers });
}
