/** Fixed Cali launch wedge — do not invent extra cities/barrios in P0 */
export const BARRIOS = [
  { id: 'san-antonio', label: 'San Antonio' },
  { id: 'granada', label: 'Granada' },
  { id: 'el-penon', label: 'El Peñón' },
  { id: 'san-fernando', label: 'San Fernando / Parque del Perro' },
] as const;

export type BarrioId = (typeof BARRIOS)[number]['id'];
export type Barrio = (typeof BARRIOS)[number];

export function barrioLabel(id: string): string {
  return BARRIOS.find((b) => b.id === id)?.label ?? id;
}
