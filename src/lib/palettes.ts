export type PaletteId =
  | "verde"
  | "azul"
  | "morada"
  | "rosada"
  | "naranja"
  | "roja"
  | "ambar"
  | "turquesa"
  | "rosa";

export interface Palette {
  id: PaletteId;
  label: string;
  swatch: string[];
}

export const PALETTES: Palette[] = [
  { id: "verde", label: "Verde", swatch: ["#111111", "#00A86B", "#00D084"] },
  { id: "azul", label: "Azul", swatch: ["#111827", "#2563EB", "#38BDF8"] },
  { id: "morada", label: "Morada", swatch: ["#17131F", "#7C3AED", "#A855F7"] },
  { id: "rosada", label: "Rosada", swatch: ["#181116", "#DB2777", "#F472B6"] },
  { id: "naranja", label: "Naranja", swatch: ["#191411", "#EA580C", "#FB923C"] },
  { id: "roja", label: "Roja", swatch: ["#171111", "#DC2626", "#F87171"] },
  { id: "ambar", label: "Ámbar", swatch: ["#171510", "#D97706", "#FBBF24"] },
  { id: "turquesa", label: "Turquesa", swatch: ["#101819", "#0D9488", "#2DD4BF"] },
  { id: "rosa", label: "Rosa intenso", swatch: ["#181313", "#E11D48", "#FB7185"] },
];

export const DEFAULT_PALETTE: PaletteId = "verde";

export function applyPalette(palette: string | null | undefined) {
  if (typeof document === "undefined") return;
  const id = PALETTES.some((p) => p.id === palette) ? palette! : DEFAULT_PALETTE;
  document.documentElement.setAttribute("data-palette", id);
  try {
    localStorage.setItem("grimorio.palette", id);
  } catch {
    /* almacenamiento no disponible */
  }
}

export function cachedPalette(): PaletteId {
  if (typeof localStorage === "undefined") return DEFAULT_PALETTE;
  try {
    const value = localStorage.getItem("grimorio.palette");
    return (PALETTES.find((p) => p.id === value)?.id ?? DEFAULT_PALETTE) as PaletteId;
  } catch {
    return DEFAULT_PALETTE;
  }
}
