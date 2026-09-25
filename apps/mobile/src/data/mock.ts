import type { BarrioId } from '../constants/barrios';
import type { OficioId } from '../constants/oficios';

export type MockPro = {
  id: string;
  name: string;
  oficios: OficioId[];
  barrio: BarrioId;
  local: boolean;
  pocoVisto?: boolean;
  rating: number;
  jobsCount: number;
  bio: string;
  rateHint: string;
};

export const MOCK_PROS: MockPro[] = [
  {
    id: 'p1',
    name: 'Carlos Restrepo',
    oficios: ['plomeria'],
    barrio: 'granada',
    local: true,
    rating: 4.8,
    jobsCount: 23,
    bio: 'Plomero de Granada. Flexible, llaves, fugas.',
    rateHint: 'Desde $80.000',
  },
  {
    id: 'p2',
    name: 'Ana Lucía Mejía',
    oficios: ['aseo'],
    barrio: 'san-antonio',
    local: true,
    rating: 4.9,
    jobsCount: 41,
    bio: 'Aseo profundo y mantenimiento de apartamentos.',
    rateHint: 'Desde $60.000',
  },
  {
    id: 'p3',
    name: 'Diego Quintero',
    oficios: ['electricidad'],
    barrio: 'el-penon',
    local: false,
    pocoVisto: true,
    rating: 4.6,
    jobsCount: 7,
    bio: 'Tableros, tomas, iluminación LED.',
    rateHint: 'Desde $90.000',
  },
  {
    id: 'p4',
    name: 'María Fernanda Soto',
    oficios: ['cerrajeria'],
    barrio: 'san-fernando',
    local: false,
    pocoVisto: true,
    rating: 4.5,
    jobsCount: 4,
    bio: 'Aperturas y cambio de cerraduras.',
    rateHint: 'Desde $70.000',
  },
];

export type MockQuote = {
  id: string;
  proId: string;
  proName: string;
  barrio: BarrioId;
  local: boolean;
  priceLabel: string;
  eta: string;
  note: string;
};

export const MOCK_QUOTES: MockQuote[] = [
  {
    id: 'q1',
    proId: 'p1',
    proName: 'Carlos Restrepo',
    barrio: 'granada',
    local: true,
    priceLabel: '$120.000',
    eta: 'mañana 9–11 a.m.',
    note: 'Incluye flexible y silicona.',
  },
  {
    id: 'q2',
    proId: 'p3',
    proName: 'Diego Quintero',
    barrio: 'el-penon',
    local: false,
    priceLabel: '$95.000',
    eta: 'hoy tarde',
    note: 'Puedo pasar después de las 4.',
  },
];
