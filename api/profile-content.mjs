import {
  isValidProfileId,
  jsonResponse,
} from './_lib/crypto.mjs';
import {
  getStore,
  isDatabaseConfigured,
} from './_lib/store.mjs';
import { verifyProfileAccess } from './_lib/authHelpers.mjs';

const PROFILE_META = {
  giridhar: {
    id: 'giridhar',
    name: 'PERSONAL',
    tagline: 'The person behind it all.',
    sections: ['about', 'portrait', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'],
  },
  recruiter: {
    id: 'recruiter',
    name: 'PROFESSIONAL',
    tagline: 'The ambition behind the work.',
    resumePdfUrl: 'https://giridharreddygoddilla.vercel.app/assets/Giridhar_Reddy_Goddilla_Resume_ATS.pdf',
  },
  creative: {
    id: 'creative',
    name: 'CREATIVE',
    tagline: 'The imagination behind the ideas.',
  },
};

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const profileId = url.searchParams.get('profileId') || '';

    if (!isValidProfileId(profileId)) {
      return jsonResponse({ authorized: false, error: 'Invalid profile ID.' }, 400);
    }

    if (!isDatabaseConfigured()) {
      return jsonResponse({
        authorized: true,
        locked: false,
        backendConfigured: false,
        profileId,
        data: PROFILE_META[profileId],
      });
    }

    const store = getStore();
    const lockRow = await store.getProfileLock(profileId);
    const isLocked = Boolean(lockRow?.is_locked && lockRow?.password_hash);
    const access = await verifyProfileAccess(request, store, profileId, lockRow);

    if (!access.authorized) {
      return jsonResponse(
        {
          authorized: false,
          locked: true,
          profileId,
          error: 'This profile is password-protected. Please authenticate to continue.',
        },
        401
      );
    }

    return jsonResponse({
      authorized: true,
      locked: isLocked,
      via: access.via,
      profileId,
      data: PROFILE_META[profileId],
    });
  } catch (err) {
    console.error('[GET /api/profile-content]', err);
    return jsonResponse(
      { authorized: false, error: 'Unable to verify profile access.' },
      500
    );
  }
}
