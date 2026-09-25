/**
 * Back-end contracts (Security PASSED WITH CONDITIONS, CEO greenlit 2026-09-24).
 *
 * Rules:
 * - Contacts: ONLY rpc('get_job_participant_contacts') — never SELECT job_participant_contacts view.
 * - Hire / confirm / admin / Local mutations ONLY via Edge functions.invoke.
 * - NEVER client-update jobs.status to confirmed / cancelled / disputed.
 * - Pro MAY client-update job active → pro_done only (that transition alone).
 * - No service role in the app — session Authorization via supabase.ts.
 */

import { supabase, isSupabaseConfigured } from './supabase';

export type EdgeName =
  | 'accept_quote'
  | 'confirm_job'
  | 'approve_proof'
  | 'reject_proof'
  | 'recompute_local'
  | 'descubre_feed'
  | 'admin_hide'
  | 'admin_ban';

export type ApiErrorCode =
  | 'not_configured'
  | 'not_signed_in'
  | 'invoke_error'
  | 'edge_error'
  | 'rpc_error'
  | 'forbidden_transition'
  | 'not_found'
  | 'update_error';

export class ApiError extends Error {
  readonly code: ApiErrorCode;

  constructor(message: string, code: ApiErrorCode) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

export type EdgeResult = {
  ok?: boolean;
  stub?: boolean;
  message?: string;
  error?: string;
  [key: string]: unknown;
};

export type JobParticipantContact = {
  job_id: string;
  job_status: string;
  seeker_display_name: string | null;
  seeker_phone: string | null;
  exact_address: string | null;
  gate_notes: string | null;
  pro_display_name: string | null;
  pro_phone: string | null;
};

export type DescubreFeedCard = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  rate_hint_cop: number | null;
  is_local: boolean;
  barrio_id: string | null;
};

export type DescubreFeedResult = {
  ok?: boolean;
  stub?: boolean;
  day?: string;
  count?: number;
  feed?: DescubreFeedCard[];
  message?: string;
  error?: string;
};

async function requireAuthedClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new ApiError(
      'Supabase no configurado. Revisa EXPO_PUBLIC_SUPABASE_URL y ANON_KEY.',
      'not_configured',
    );
  }
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new ApiError('Debes iniciar sesión para continuar.', 'not_signed_in');
  }
  return supabase;
}

/** Low-level Edge invoke with user session. */
export async function invokeEdge<T extends EdgeResult = EdgeResult>(
  name: EdgeName,
  body: Record<string, unknown> = {},
): Promise<T> {
  const client = await requireAuthedClient();
  const { data, error } = await client.functions.invoke(name, { body });
  if (error) {
    throw new ApiError(error.message || `Error al llamar ${name}`, 'invoke_error');
  }
  const payload = (data ?? {}) as T;
  if (payload && typeof payload === 'object' && typeof payload.error === 'string' && payload.error) {
    throw new ApiError(payload.error, 'edge_error');
  }
  return payload;
}

/** Spanish Alert body: prove UI path when Edge returns stub:true. */
export function describeEdgeResult(data: EdgeResult | null | undefined, fallbackOk: string): string {
  if (data?.stub === true) {
    return `Edge respondió stub — ruta UI comprobada.${data.message ? `\n${data.message}` : ''}`;
  }
  if (data?.message && typeof data.message === 'string') return data.message;
  return fallbackOk;
}

export function acceptQuote(quoteId: string) {
  return invokeEdge('accept_quote', { quote_id: quoteId });
}

export function confirmJob(jobId: string) {
  return invokeEdge('confirm_job', { job_id: jobId });
}

export function approveProof(proofId: string) {
  return invokeEdge('approve_proof', { proof_id: proofId });
}

export function rejectProof(proofId: string, reason: string) {
  return invokeEdge('reject_proof', { proof_id: proofId, reason });
}

export function recomputeLocal(proId: string, barrioId: string) {
  return invokeEdge('recompute_local', { pro_id: proId, barrio_id: barrioId });
}

export function fetchDescubreFeed(opts?: { barrioId?: string; limit?: number }) {
  return invokeEdge<DescubreFeedResult>('descubre_feed', {
    barrio_id: opts?.barrioId ?? null,
    limit: opts?.limit ?? 20,
  });
}

export function adminHide(proId: string, hidden = true) {
  return invokeEdge('admin_hide', { pro_id: proId, hidden });
}

export function adminBan(userId: string, ban = true) {
  return invokeEdge('admin_ban', { user_id: userId, ban });
}

/**
 * Participant contacts via SECURITY DEFINER RPC only.
 * Never SELECT from job_participant_contacts view.
 */
export async function getJobParticipantContacts(
  jobId: string,
): Promise<JobParticipantContact[]> {
  const client = await requireAuthedClient();
  const { data, error } = await client.rpc('get_job_participant_contacts', {
    p_job_id: jobId,
  });
  if (error) {
    throw new ApiError(error.message || 'Error al cargar contactos', 'rpc_error');
  }
  return (data ?? []) as JobParticipantContact[];
}

/** Graceful contacts for UI — empty array on any failure. */
export async function getJobParticipantContactsSafe(
  jobId: string,
): Promise<JobParticipantContact[]> {
  try {
    return await getJobParticipantContacts(jobId);
  } catch {
    return [];
  }
}

/**
 * Pro-only client transition: active → pro_done.
 * Refuses confirmed / cancelled / disputed / any other status change.
 */
export async function markJobProDone(jobId: string): Promise<{ id: string; status: string }> {
  const client = await requireAuthedClient();

  const { data: job, error: fetchErr } = await client
    .from('jobs')
    .select('id, status')
    .eq('id', jobId)
    .maybeSingle();

  if (fetchErr) {
    throw new ApiError(fetchErr.message, 'update_error');
  }
  if (!job) {
    throw new ApiError('Trabajo no encontrado', 'not_found');
  }
  if (job.status !== 'active') {
    throw new ApiError(
      `Solo se permite active → pro_done (estado actual: ${job.status}). Confirmación, cancelación y disputa van por Edge.`,
      'forbidden_transition',
    );
  }

  const { data, error } = await client
    .from('jobs')
    .update({ status: 'pro_done' })
    .eq('id', jobId)
    .eq('status', 'active')
    .select('id, status')
    .single();

  if (error) {
    throw new ApiError(error.message, 'update_error');
  }
  if (!data || data.status !== 'pro_done') {
    throw new ApiError('No se pudo marcar como hecho', 'update_error');
  }
  return data;
}
