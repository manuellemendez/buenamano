/** Spanish (Colombia) microcopy from DESIGN-SYSTEM.md */
export const COPY = {
  fairnessDescubre:
    'BuenaMano no vende el primer puesto. Si alguien aparece arriba, es por reseñas de acá — no porque pagó.',
  fairnessChip: 'Descubre · hoy hay cupo para oficios poco vistos',
  quoteSortLegend: 'Ordenado por confianza local, no por quien pagó',
  localSheet:
    'Probó barrio + reseñas con texto de vecinos de acá. No se compra.',
  reviewGate:
    'Las estrellas solas no cuentan para Local. Escribe al menos un poco: ¿qué hizo y cómo te fue?',
  reviewPlaceholder: 'Llegó puntual, cambió el flexible y dejó el baño limpio.',
  onboardingBarrios:
    'Empezamos en San Antonio, Granada, El Peñón y San Fernando. Sin humo nacional.',
  terminosDraft: 'Términos (borrador — revisión legal pendiente)',
  privacidadDraft: 'Privacidad / datos personales (Ley 1581 — needs App Legal Advisor)',
  soporte: 'Soporte WhatsApp: (pendiente) · Lun–Sáb 8 a.m.–6 p.m.',
  pocoVisto: 'poco visto',
  sinLocal: 'Sin Local todavía — puede ser bueno; aún no tiene prueba de barrio',
} as const;

export const REVIEW_SCAFFOLDS = [
  'Llegó a tiempo',
  'Precio claro',
  'Dejó limpio',
  'Explicó el daño',
  'Lo contrataría otra vez',
] as const;

export const REPORT_REASONS = [
  { id: 'no-llego', label: 'No llegó' },
  { id: 'cobro-distinto', label: 'Cobro distinto' },
  { id: 'comportamiento', label: 'Comportamiento' },
  { id: 'resena-falsa', label: 'Reseña falsa' },
  { id: 'otro', label: 'Otro' },
] as const;

export const JOB_STEPS = [
  'Solicitud',
  'Cotizaciones',
  'Aceptado',
  'En curso',
  'Hecho',
  'Reseña',
] as const;

export const REVIEW_MIN_CHARS = 40;
