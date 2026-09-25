import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Security gate: auth + read scaffolding only until Back-end lands Security P0s.
// Do not invoke hire/accept/confirm/admin/Local mutation edge functions from the client yet.

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
