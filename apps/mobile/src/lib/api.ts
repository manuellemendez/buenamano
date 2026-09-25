/**
 * Back-end contracts (Security PASSED WITH CONDITIONS, CEO greenlit 2026-09-24).
 *
 * Rules:
 * - Contacts: ONLY rpc('get_job_participant_contacts') — never SELECT job_participant_contacts view.
 * - Hire / confirm / admin / Local mutations ONLY via Edge functions.invoke.
 * - Admin reports: list via rpc('list_admin_reports'); triage via Edge admin_triage_report — never client UPDATE reports.
 * - NEVER client-update jobs.status to confirmed / cancelled / disputed.
 * - Pro MAY client-update job active → pro_done only (that transition alone).
 * - No service role in the app — session Authorization via supabase.ts.
 */

import { getSupabase, isSupabaseConfigured } from './supabase';
import {
  barrioUuid,
  DEFAULT_BARRIO_UUID,
  oficioUuid,
} from '../constants/ids';
import { oficioLabel } from '../constants/oficios';

export type EdgeName =
  | 'accept_quote'
  | 'confirm_job'
  | 'approve_proof'
  | 'reject_proof'
  | 'recompute_local'
  | 'descubre_feed'
  | 'admin_hide'
  | 'admin_ban'
  | 'admin_triage_report';

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
  const client = getSupabase();
  if (!isSupabaseConfigured || !client) {
    throw new ApiError(
      'Supabase no configurado. Revisa EXPO_PUBLIC_SUPABASE_URL y ANON_KEY.',
      'not_configured',
    );
  }
  const {
    data: { session },
  } = await client.auth.getSession();
  if (!session?.access_token) {
    throw new ApiError('Debes iniciar sesión para continuar.', 'not_signed_in');
  }
  return client;
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

export type ReportTriageStatus = 'open' | 'triaged' | 'closed';

/** Admin-only triage — Edge only; never client UPDATE reports. */
export function adminTriageReport(reportId: string, status: ReportTriageStatus) {
  return invokeEdge('admin_triage_report', { report_id: reportId, status });
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

// ─── P0 live writes (RLS-scoped) ────────────────────────────────────────────

async function requireUid(): Promise<{
  client: NonNullable<ReturnType<typeof getSupabase>>;
  uid: string;
}> {
  const client = await requireAuthedClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) {
    throw new ApiError('Debes iniciar sesión para continuar.', 'not_signed_in');
  }
  return { client, uid: user.id };
}

function mapUrgency(label: string): 'urgent' | 'normal' | 'low' {
  if (label.startsWith('Urgente')) return 'urgent';
  if (label.startsWith('Flexible')) return 'low';
  return 'normal';
}

async function uriToBlob(uri: string): Promise<{ body: Blob; contentType: string }> {
  const res = await fetch(uri);
  const blob = await res.blob();
  return { body: blob, contentType: blob.type || 'image/jpeg' };
}

function tinyJpegBlob(): Blob {
  const bytes = Uint8Array.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
    0x00, 0x01, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
    0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
    0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20,
    0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27,
    0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0xff, 0xc4, 0x00, 0x14,
    0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0x7f, 0xff, 0xd9,
  ]);
  return new Blob([bytes], { type: 'image/jpeg' });
}

export type CreateJobRequestInput = {
  oficioSlug: string;
  description: string;
  urgencyLabel: string;
  barrioId?: string | null;
  photoUris?: string[];
};

export async function createJobRequest(
  input: CreateJobRequestInput,
): Promise<{ id: string }> {
  const { client, uid } = await requireUid();
  const oficioId = oficioUuid(input.oficioSlug);
  const barrioId = input.barrioId ? barrioUuid(input.barrioId) : DEFAULT_BARRIO_UUID;
  const label = oficioLabel(input.oficioSlug);
  const short = input.description.trim().slice(0, 40);
  const title = `${label}${short ? ` — ${short}` : ''}`;

  const { data, error } = await client
    .from('job_requests')
    .insert({
      seeker_id: uid,
      oficio_id: oficioId,
      barrio_id: barrioId,
      title,
      description: input.description.trim(),
      urgency: mapUrgency(input.urgencyLabel),
      status: 'open',
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new ApiError(error?.message || 'No se pudo crear la solicitud', 'update_error');
  }

  const requestId = data.id as string;
  for (let i = 0; i < (input.photoUris?.length ?? 0); i++) {
    const path = `requests/${requestId}/${i}.jpg`;
    try {
      const { body, contentType } = await uriToBlob(input.photoUris![i]);
      const { error: upErr } = await client.storage.from('job-media').upload(path, body, {
        contentType,
        upsert: true,
      });
      if (upErr) {
        console.warn('[createJobRequest] upload', upErr.message);
        continue;
      }
      const { error: mediaErr } = await client.from('job_request_media').insert({
        request_id: requestId,
        storage_path: path,
        kind: 'work_photo',
        uploaded_by: uid,
      });
      if (mediaErr) console.warn('[createJobRequest] media', mediaErr.message);
    } catch (e) {
      console.warn('[createJobRequest] photo failed', e);
    }
  }

  return { id: requestId };
}

export type SubmitQuoteInput = {
  requestId: string;
  priceCop: number;
  etaHours: number;
  notes?: string;
};

export async function submitQuote(input: SubmitQuoteInput): Promise<{ id: string }> {
  const { client, uid } = await requireUid();
  if (!input.requestId || input.priceCop < 0 || !(input.etaHours > 0)) {
    throw new ApiError('Precio y ETA (horas > 0) son obligatorios.', 'update_error');
  }
  const { data, error } = await client
    .from('quotes')
    .insert({
      request_id: input.requestId,
      pro_id: uid,
      price_cop: Math.round(input.priceCop),
      eta_hours: Math.round(input.etaHours),
      notes: input.notes?.trim() || null,
    })
    .select('id')
    .single();

  if (error || !data) {
    const msg = error?.message || 'No se pudo enviar la cotización';
    if (/pro_matches|policy|row-level|violates/i.test(msg)) {
      throw new ApiError(
        'No puedes cotizar esta solicitud (RLS: el pro debe coincidir con oficio/barrio abierto).',
        'update_error',
      );
    }
    throw new ApiError(msg, 'update_error');
  }
  return { id: data.id as string };
}

export type SubmitReviewInput = {
  jobId: string;
  rating: number;
  body: string;
};

export async function submitReview(input: SubmitReviewInput): Promise<{ id: string }> {
  const { client, uid } = await requireUid();
  const body = input.body.trim();
  if (body.length < 40) {
    throw new ApiError('La reseña necesita al menos 40 caracteres.', 'update_error');
  }
  if (input.rating < 1 || input.rating > 5) {
    throw new ApiError('Calificación inválida.', 'update_error');
  }

  const { data: job, error: jobErr } = await client
    .from('jobs')
    .select('id, seeker_id, pro_id, barrio_id, status')
    .eq('id', input.jobId)
    .maybeSingle();

  if (jobErr) throw new ApiError(jobErr.message, 'update_error');
  if (!job) throw new ApiError('Trabajo no encontrado', 'not_found');
  if (job.seeker_id !== uid) {
    throw new ApiError('Solo el cliente del trabajo puede dejar reseña.', 'update_error');
  }

  const { data, error } = await client
    .from('reviews')
    .insert({
      job_id: job.id,
      seeker_id: uid,
      pro_id: job.pro_id,
      barrio_id: job.barrio_id,
      rating: input.rating,
      body,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new ApiError(error?.message || 'No se pudo publicar la reseña', 'update_error');
  }
  return { id: data.id as string };
}

const PROOF_KINDS = ['utility_bill', 'lease', 'workplace'] as const;

export type SubmitProofInput = {
  barrioId: string;
  photoUris?: string[];
  slotCount?: number;
};

export async function submitBarrioProofs(
  input: SubmitProofInput,
): Promise<{ paths: string[] }> {
  const { client, uid } = await requireUid();
  const barrioId = barrioUuid(input.barrioId);
  const count = input.photoUris?.length
    ? input.photoUris.length
    : Math.max(1, input.slotCount ?? 1);
  const ts = Date.now();
  const paths: string[] = [];

  for (let i = 0; i < count; i++) {
    const kind = PROOF_KINDS[i % PROOF_KINDS.length];
    const path = `${uid}/${barrioId}/${ts}-${i}.jpg`;
    const uri = input.photoUris?.[i];
    let body: Blob;
    let contentType = 'image/jpeg';
    if (uri) {
      const up = await uriToBlob(uri);
      body = up.body;
      contentType = up.contentType;
    } else {
      body = tinyJpegBlob();
    }
    const { error: upErr } = await client.storage.from('local-proof').upload(path, body, {
      contentType,
      upsert: true,
    });
    if (upErr) {
      throw new ApiError(upErr.message || 'Error al subir prueba', 'update_error');
    }
    const { error: rowErr } = await client.from('barrio_proofs').insert({
      pro_id: uid,
      barrio_id: barrioId,
      kind,
      storage_path: path,
      status: 'pending',
    });
    if (rowErr) {
      throw new ApiError(rowErr.message || 'Error al registrar prueba', 'update_error');
    }
    paths.push(path);
  }

  const { data: existing } = await client
    .from('pro_barrios')
    .select('pro_id')
    .eq('pro_id', uid)
    .eq('barrio_id', barrioId)
    .maybeSingle();

  if (existing) {
    await client
      .from('pro_barrios')
      .update({ proof_status: 'pending' })
      .eq('pro_id', uid)
      .eq('barrio_id', barrioId);
  } else {
    await client.from('pro_barrios').insert({
      pro_id: uid,
      barrio_id: barrioId,
      proof_status: 'pending',
    });
  }

  return { paths };
}

export type UpdateProfileInput = {
  displayName?: string;
  phone?: string | null;
  bio?: string | null;
  rateHintCop?: number | null;
  oficioSlugs?: string[];
};

export async function updateOwnProfile(input: UpdateProfileInput): Promise<void> {
  const { client, uid } = await requireUid();
  const patch: Record<string, unknown> = {};
  if (input.displayName !== undefined) patch.display_name = input.displayName.trim();
  if (input.phone !== undefined) patch.phone = input.phone?.trim() || null;
  if (Object.keys(patch).length) {
    const { error } = await client.from('profiles').update(patch).eq('id', uid);
    if (error) throw new ApiError(error.message, 'update_error');
  }

  if (input.bio !== undefined || input.rateHintCop !== undefined) {
    const { error } = await client.from('pro_profiles').upsert(
      {
        user_id: uid,
        bio: input.bio ?? null,
        rate_hint_cop: input.rateHintCop ?? null,
      },
      { onConflict: 'user_id' },
    );
    if (error) throw new ApiError(error.message, 'update_error');
  }

  if (input.oficioSlugs) {
    await client.from('pro_oficios').delete().eq('pro_id', uid);
    if (input.oficioSlugs.length) {
      const rows = input.oficioSlugs.map((slug) => ({
        pro_id: uid,
        oficio_id: oficioUuid(slug),
      }));
      const { error } = await client.from('pro_oficios').insert(rows);
      if (error) throw new ApiError(error.message, 'update_error');
    }
  }
}

export type SubmitReportInput = {
  targetType: 'profile' | 'job_request' | 'quote' | 'job' | 'review';
  targetId: string;
  reason: string;
};

export async function submitReport(input: SubmitReportInput): Promise<{ id: string }> {
  const { client, uid } = await requireUid();
  if (!input.targetId || !/^[0-9a-f-]{36}$/i.test(input.targetId)) {
    throw new ApiError('Falta el objetivo del reporte (UUID válido).', 'update_error');
  }
  const { data, error } = await client
    .from('reports')
    .insert({
      reporter_id: uid,
      target_type: input.targetType,
      target_id: input.targetId,
      reason: input.reason.trim(),
    })
    .select('id')
    .single();
  if (error || !data) {
    throw new ApiError(error?.message || 'No se pudo enviar el reporte', 'update_error');
  }
  return { id: data.id as string };
}

export type ReportRow = {
  id: string;
  reporter_id?: string;
  reason: string;
  target_type: string;
  target_id: string;
  status: string;
  created_at: string;
};

/** Reporter: own rows only (RLS select_own). */
export async function listOwnReports(): Promise<ReportRow[]> {
  const { client } = await requireUid();
  const { data, error } = await client
    .from('reports')
    .select('id, reporter_id, reason, target_type, target_id, status, created_at')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw new ApiError(error.message, 'rpc_error');
  return (data ?? []) as ReportRow[];
}

/** Admin queue via SECURITY DEFINER RPC — admin JWT only. */
export async function listAdminReports(opts?: {
  status?: string | null;
  limit?: number;
  offset?: number;
}): Promise<ReportRow[]> {
  const client = await requireAuthedClient();
  const { data, error } = await client.rpc('list_admin_reports', {
    p_status: opts?.status ?? null,
    p_limit: opts?.limit ?? 50,
    p_offset: opts?.offset ?? 0,
  });
  if (error) {
    throw new ApiError(error.message || 'No se pudo cargar la cola de reportes', 'rpc_error');
  }
  return (data ?? []) as ReportRow[];
}
