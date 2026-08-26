export interface UnitGroup {
  label: string;
  units: { value: string; label: string }[];
}

/** Catálogo de unidades. Ampliable sin cambios de arquitectura. */
export const UNIT_GROUPS: UnitGroup[] = [
  {
    label: "Peso",
    units: [
      { value: "kg", label: "Kilogramo (kg)" },
      { value: "g", label: "Gramo (g)" },
      { value: "mg", label: "Miligramo (mg)" },
      { value: "lb", label: "Libra (lb)" },
      { value: "oz", label: "Onza (oz)" },
    ],
  },
  {
    label: "Volumen",
    units: [
      { value: "L", label: "Litro (L)" },
      { value: "ml", label: "Mililitro (ml)" },
      { value: "gal", label: "Galón (gal)" },
      { value: "qt", label: "Cuarto (qt)" },
      { value: "pt", label: "Pinta (pt)" },
      { value: "cup", label: "Taza (cup)" },
      { value: "fl oz", label: "Onza líquida (fl oz)" },
    ],
  },
  {
    label: "Medidas culinarias",
    units: [
      { value: "tbsp", label: "Cucharada (tbsp)" },
      { value: "tsp", label: "Cucharadita (tsp)" },
      { value: "½ tbsp", label: "½ cucharada" },
      { value: "½ tsp", label: "½ cucharadita" },
      { value: "pizca", label: "Pizca" },
      { value: "una pizca", label: "Una pizca" },
      { value: "puñado", label: "Puñado" },
      { value: "chorrito", label: "Chorrito" },
      { value: "gota", label: "Gota" },
      { value: "al gusto", label: "Al gusto" },
      { value: "a gusto", label: "A gusto / según preferencia" },
    ],
  },
  {
    label: "Cantidades",
    units: [
      { value: "un", label: "Unidad (un)" },
      { value: "porción", label: "Porción" },
      { value: "rebanada", label: "Rebanada" },
      { value: "rodaja", label: "Rodaja" },
      { value: "trozo", label: "Trozo" },
      { value: "pedazo", label: "Pedazo" },
      { value: "tira", label: "Tira" },
      { value: "cubo", label: "Cubo" },
      { value: "bola", label: "Bola" },
      { value: "hoja", label: "Hoja" },
      { value: "rama", label: "Rama" },
      { value: "ramita", label: "Ramita" },
      { value: "diente", label: "Diente" },
      { value: "cabeza", label: "Cabeza" },
    ],
  },
];

export const ALL_UNITS = UNIT_GROUPS.flatMap((g) => g.units);

/** Sinónimos escritos en texto libre → unidad normalizada. */
const ALIASES: Record<string, string> = {
  kilogramo: "kg",
  kilogramos: "kg",
  kilo: "kg",
  kilos: "kg",
  kg: "kg",
  gramo: "g",
  gramos: "g",
  gr: "g",
  grs: "g",
  g: "g",
  miligramo: "mg",
  miligramos: "mg",
  mg: "mg",
  libra: "lb",
  libras: "lb",
  lb: "lb",
  onza: "oz",
  onzas: "oz",
  oz: "oz",
  litro: "L",
  litros: "L",
  lt: "L",
  l: "L",
  mililitro: "ml",
  mililitros: "ml",
  ml: "ml",
  cc: "ml",
  taza: "cup",
  tazas: "cup",
  cup: "cup",
  cups: "cup",
  cucharada: "tbsp",
  cucharadas: "tbsp",
  cda: "tbsp",
  cdas: "tbsp",
  tbsp: "tbsp",
  cucharadita: "tsp",
  cucharaditas: "tsp",
  cdta: "tsp",
  cdtas: "tsp",
  tsp: "tsp",
  pizca: "pizca",
  pizcas: "pizca",
  puñado: "puñado",
  chorrito: "chorrito",
  gota: "gota",
  gotas: "gota",
  unidad: "un",
  unidades: "un",
  un: "un",
  u: "un",
  diente: "diente",
  dientes: "diente",
  rama: "rama",
  ramas: "rama",
  ramita: "ramita",
  hoja: "hoja",
  hojas: "hoja",
  rebanada: "rebanada",
  rebanadas: "rebanada",
  rodaja: "rodaja",
  rodajas: "rodaja",
  trozo: "trozo",
  trozos: "trozo",
  porción: "porción",
  porciones: "porción",
  sobre: "un",
};

export function normalizeUnit(raw: string): string | null {
  const key = raw.trim().toLowerCase().replace(/\.$/, "");
  if (!key) return null;
  return ALIASES[key] ?? (ALL_UNITS.some((u) => u.value.toLowerCase() === key) ? key : null);
}

export function formatQuantity(q: number | null | undefined): string {
  if (q === null || q === undefined) return "";
  return Number.isInteger(q) ? String(q) : String(q).replace(/\.0+$/, "");
}
