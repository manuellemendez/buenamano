import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Security PASSED WITH CONDITIONS (CEO greenlit 2026-09-24).
// Live Edge/RPC wiring allowed via src/lib/api.ts:
// - Contacts: ONLY rpc('get_job_participant_contacts') — never SELECT job_participant_contacts.
// - Hire / confirm / admin / Local mutations ONLY via functions.invoke helpers.
// - NEVER client-update jobs.status to confirmed / cancelled / disputed.
// - Pro MAY client-update active → pro_done only.
// Never put the service role key in the app — anon + user session Authorization only.

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(url && anonKey);

let cached: SupabaseClient | null | undefined;

/**
 * Expo web SSR evaluates modules in Node (no native WebSocket).
 * Eager createClient at import time crashes Metro; defer until browser / native.
 */
function isSafeToCreateClient(): boolean {
  if (typeof window !== 'undefined') return true;
  const nodeVersion =
    typeof process !== 'undefined' &&
    typeof (process as { versions?: { node?: string } }).versions?.node === 'string';
  // Hermes / JSC: no window, but also no process.versions.node → allow create.
  return !nodeVersion;
}

/** Lazy client — null when env missing or during Node SSR (Expo web). */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!isSafeToCreateClient()) return null;
  if (cached === undefined) {
    cached = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: typeof window !== 'undefined',
      },
    });
  }
  return cached;
}

export function getSupabaseStatus(): 'ready' | 'not_configured' {
  return isSupabaseConfigured ? 'ready' : 'not_configured';
}
