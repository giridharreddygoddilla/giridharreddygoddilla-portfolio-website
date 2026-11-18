import {
  VALID_PROFILES,
  jsonResponse,
} from '../_lib/crypto.mjs';
import {
  getMissingDatabaseVars,
  getStore,
  isDatabaseConfigured,
} from '../_lib/store.mjs';
import { verifyProfileAccess } from '../_lib/authHelpers.mjs';

export async function GET(request) {
  try {
    if (!isDatabaseConfigured()) {
      const profiles = {};
      for (const id of VALID_PROFILES) {
        profiles[id] = { isLocked: false, hasPassword: false, unlocked: true };
      }
      return jsonResponse({
        backendConfigured: false,
        missingVars: getMissingDatabaseVars(),
        profiles,
      });
    }

    const store = getStore();
    const rows = await store.listProfileLocks();
    const profiles = {};

    for (const row of rows) {
      const isLocked = Boolean(row.is_locked && row.password_hash);
      const access = await verifyProfileAccess(request, store, row.profile_id, row);
      profiles[row.profile_id] = {
        isLocked,
        hasPassword: Boolean(row.password_hash),
        unlocked: access.authorized,
        updatedAt: row.updated_at,
      };
    }

    return jsonResponse({
      backendConfigured: true,
      profiles,
    });
  } catch (err) {
    console.error('[GET /api/profiles/status]', err);
    return jsonResponse(
      { error: 'Unable to load profile security status.' },
      500
    );
  }
}
