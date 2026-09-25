/** P0 core oficios — home services only (not restaurants) */
export const OFICIOS = [
  { id: 'plomeria', label: 'Plomería' },
  { id: 'electricidad', label: 'Electricidad' },
  { id: 'aseo', label: 'Aseo' },
  { id: 'cerrajeria', label: 'Cerrajería' },
] as const;

export type OficioId = (typeof OFICIOS)[number]['id'];
export type Oficio = (typeof OFICIOS)[number];

export function oficioLabel(id: string): string {
  return OFICIOS.find((o) => o.id === id)?.label ?? id;
}
