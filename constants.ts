import { CqpLevel, BarType } from './types';

export const PRICES = {
  inflationFactor: 1.35, 
  extraHour: 2000,
  extraHourMundial: 1500,
  
  barmanBase: 1600,
  barmanExtraHour: 300,
  djBase: 3700,
  djExtraHour: 200,
  staffBaseHours: 6,

  shopper: 2200,
  themedSetup: 5000,
  foodBase: 2500,

  bar: {
    esencial: 4900,
    clasica: 5500,
    premium: 6800,
  } as Record<BarType, number>,

  cqpFactor: {
    eco: 1.0,   // LOTO SIMPLE
    std: 1.15,  // AURA ELEGANCE
    prem: 1.50, // MANTRA (Ajustado de 1.20 a 1.50 para incremento de ~25%)
  } as Record<CqpLevel, number>,

  baseHours: {
    eco: 5,
    std: 6, // Puede ser 7
    prem: 7 // Puede ser 8
  } as Record<CqpLevel, number>
};

export const LEVEL_NAMES: Record<CqpLevel, string> = {
  eco: "LOTO SIMPLE",
  std: "AURA ELEGANCE",
  prem: "MANTRA"
};

export const TIERS = [
  { min: 15, max: 40, base: 6400, perPerson: 95, label: "Tramo Bajo (15-40)" },
  { min: 41, max: 60, base: 9500, perPerson: 110, label: "Tramo Medio (41-60)" },
  { min: 61, max: 80, base: 13500, perPerson: 130, label: "Tramo Alto (61-80)" },
];

export const CQP_DESCRIPTIONS: Record<CqpLevel, string> = {
  eco: "Renta de espacio por 5 horas (máx 12am) * Descorche gratis * Seguridad profesional * Limpieza post evento * Área de estacionamiento * Montaje sala lounge * Refrigerador * Iluminación * Pantallas * Proyector * Karaoke * Sonido * Láser",
  std: "Renta de espacio 6-7 horas (11am-6pm ó 7pm-2am) * DJ Pro (6HRS) * Mesa de Beer Pong * Regalo sorpresa al anfitrión * Descorche gratis * Seguridad profesional * Limpieza post evento * Área de estacionamiento * Montaje sala lounge * Refrigerador * Iluminación * Pantallas * Proyector * Karaoke * Sonido * Láser",
  prem: "Renta de espacio 7-8 horas (11am-7pm ó 7pm-3am) * Barra Libre Clásica (6HRS) * Barman Pro (6HRS) * DJ Pro (6HRS) * Shots de bienvenida * Chilaquiles post evento * Cocina disponible * Mesa de Beer Pong * Regalo sorpresa al anfitrión * Descorche gratis * Seguridad profesional * Limpieza post evento * Área de estacionamiento * Montaje sala lounge * Refrigerador * Iluminación * Pantallas * Proyector * Karaoke * Sonido * Láser"
};

export const MONTH_DISCOUNTS: Record<number, number> = {
  0: 0.35, 1: 0.35, // Ene-Feb
  2: 0.30, 3: 0.30, // Mar-Abr
  4: 0.25, 5: 0.25, // May-Jun
  6: 0.20,          // Jul
  7: 0.20, 8: 0.20, 9: 0.20, 10: 0.20, 11: 0.20 // Ago en adelante
};

export const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
