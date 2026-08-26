/** Catálogo base. La base de datos también lo almacena y permite ampliarlo. */
export const CATEGORY_TREE: Record<string, string[]> = {
  Salado: [
    "Masas y Panes",
    "Antojos y Comida Rápida",
    "Entradas",
    "Cocina Internacional",
    "Platos Principales",
  ],
  Dulce: ["Masas Dulces", "Frituras Dulces", "Repostería", "Postres", "Dulces"],
};

export const CATEGORIES = Object.keys(CATEGORY_TREE);

export function subcategoriesOf(category: string): string[] {
  return CATEGORY_TREE[category] ?? [];
}
