/**
 * Seed UUID maps — UI uses slug ids; DB FKs need UUIDs.
 * Keep in sync with supabase seeds (project urdtuorcfxjwhaqetiov).
 */

export const OFICIO_UUID: Record<string, string> = {
  plomeria: '67f9c29b-5695-4d10-b245-109c340ec9b3',
  electricidad: '20627b47-0508-48e8-af9e-8608b4a1fdb5',
  aseo: '29d0441d-f1e4-4dee-9a5c-4d87cb076433',
  cerrajeria: 'af9c212c-28d2-4dd9-907c-f6b3399d0a54',
};

export const BARRIO_UUID: Record<string, string> = {
  'el-penon': '89c2e012-ff11-4fc7-82c0-e0cdba775ec9',
  granada: '86523348-ff86-4ccf-9752-2a72936befd1',
  'san-antonio': '06b7534d-0f90-4ec5-9e9c-24b0927554aa',
  'san-fernando': 'd2d08f78-c182-4a6e-aac8-642370b3260c',
};

/** Default barrio when profile.home_barrio_id missing (Granada). */
export const DEFAULT_BARRIO_UUID = BARRIO_UUID.granada;

export function oficioUuid(slugOrId: string): string {
  if (OFICIO_UUID[slugOrId]) return OFICIO_UUID[slugOrId];
  if (/^[0-9a-f-]{36}$/i.test(slugOrId)) return slugOrId;
  throw new Error(`Oficio desconocido: ${slugOrId}`);
}

export function barrioUuid(slugOrId: string): string {
  if (BARRIO_UUID[slugOrId]) return BARRIO_UUID[slugOrId];
  if (/^[0-9a-f-]{36}$/i.test(slugOrId)) return slugOrId;
  throw new Error(`Barrio desconocido: ${slugOrId}`);
}

export function barrioSlugFromUuid(uuid: string | null | undefined): string | null {
  if (!uuid) return null;
  const entry = Object.entries(BARRIO_UUID).find(([, id]) => id === uuid);
  return entry?.[0] ?? null;
}
