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

/** Null when env placeholders are missing — app must still boot. */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null;

export function getSupabaseStatus(): 'ready' | 'not_configured' {
  return isSupabaseConfigured ? 'ready' : 'not_configured';
}
