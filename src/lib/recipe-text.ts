import { formatQuantity, normalizeUnit } from "./units";
import { emptyDraft, type FullRecipe, type Ingredient, type RecipeDraft } from "./types";

/* ---------------- normalización de texto ---------------- */

export function foldText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/* ---------------- compartir como texto ---------------- */

export function ingredientLine(i: Ingredient): string {
  const parts = [formatQuantity(i.quantity), i.unit, i.name].filter(Boolean);
  const base = parts.join(" ").replace(/\s+/g, " ").trim();
  return i.note ? `${base} (${i.note})` : base;
}

export function recipeToPlainText(recipe: {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  keywords: string[];
  instructions: string;
  video_links?: string[];
  ingredients: Ingredient[];
  comments: { entry_date: string; body: string }[];
  original_author_name: string;
  shared_by_name?: string | null;
  source_note?: string | null;
}): string {
  const line = "━━━━━━━━━━━━━━━━";
  const out: string[] = [line, recipe.title.toUpperCase(), line, ""];

  out.push(`Autor: ${recipe.original_author_name || "Sin autor"}`);
  if (recipe.shared_by_name) out.push(`Compartida por: ${recipe.shared_by_name}`);
  if (recipe.source_note) out.push(`Fuente: ${recipe.source_note}`);
  out.push("");

  if (recipe.category) out.push(`Categoría: ${recipe.category}`);
  if (recipe.subcategory) out.push(`Subcategoría: ${recipe.subcategory}`);
  if (recipe.keywords.length) out.push(`Palabras clave: ${recipe.keywords.join(", ")}`);

  if (recipe.description.trim()) {
    out.push("", "DESCRIPCIÓN", "", recipe.description.trim());
  }
  if (recipe.ingredients.length) {
    out.push("", "INGREDIENTES", "");
    recipe.ingredients.forEach((i) => out.push(`• ${ingredientLine(i)}`));
  }
  if (recipe.instructions.trim()) {
    out.push("", "PREPARACIÓN", "", recipe.instructions.trim());
  }
  const videos = (recipe.video_links ?? []).filter((v) => v.trim());
  if (videos.length) {
    out.push("", "VIDEOS", "");
    videos.forEach((v) => out.push(`• ${v.trim()}`));
  }
  if (recipe.comments.length) {
    out.push("", "MIS COMENTARIOS", "");
    recipe.comments.forEach((c) => out.push(formatDate(c.entry_date), c.body, ""));
  }
  out.push("", "— Grimorio Dev");
  return out.join("\n");
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function todayISO(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/* ---------------- formato .arkrecipe ---------------- */

export const ARKRECIPE_VERSION = 1;

export function toArkRecipe(recipe: FullRecipe, sharedBy: string) {
  return {
    format: "arkrecipe",
    version: ARKRECIPE_VERSION,
    recipe_id: recipe.id,
    title: recipe.title,
    category: recipe.category,
    subcategory: recipe.subcategory,
    keywords: recipe.keywords,
    description: recipe.description,
    instructions: recipe.instructions,
    video_links: recipe.video_links ?? [],
    ingredients: recipe.ingredients.map((i) => ({
      q: i.quantity,
      u: i.unit,
      n: i.name,
      note: i.note || undefined,
    })),
    comments: recipe.comments.map((c) => ({ d: c.entry_date, t: c.body })),
    original_author_name: recipe.original_author_name,
    original_author_id: recipe.original_author_id,
    shared_by_name: sharedBy,
    source_note: recipe.source_note,
    origin_history: [
      ...(recipe.origin_history ?? []),
      { user: sharedBy, action: "compartida", date: todayISO() },
    ],
  };
}

export interface ArkParseResult {
  ok: boolean;
  error?: string;
  draft?: RecipeDraft;
  originalAuthor?: string;
}

export function parseArkRecipe(raw: string): ArkParseResult {
  let json: Record<string, unknown>;
  try {
    json = JSON.parse(raw);
  } catch {
    return { ok: false, error: "El archivo no es una receta de Grimorio Dev válida." };
  }
  if (json["format"] !== "arkrecipe") {
    return { ok: false, error: "El archivo no tiene el formato .arkrecipe." };
  }
  const draft = emptyDraft();
  draft.title = String(json["title"] ?? "");
  draft.description = String(json["description"] ?? "");
  draft.category = String(json["category"] ?? "");
  draft.subcategory = String(json["subcategory"] ?? "");
  draft.keywords = Array.isArray(json["keywords"]) ? (json["keywords"] as string[]) : [];
  draft.instructions = String(json["instructions"] ?? "");
  draft.video_links = Array.isArray(json["video_links"])
    ? (json["video_links"] as string[]).map((v) => String(v))
    : [];
  draft.origin_type = "compartida";
  draft.original_author_name = String(json["original_author_name"] ?? "Desconocido");
  draft.original_author_id = (json["original_author_id"] as string) ?? null;
  draft.shared_by_name = (json["shared_by_name"] as string) ?? null;
  draft.source_note = (json["source_note"] as string) ?? null;
  draft.origin_history = Array.isArray(json["origin_history"])
    ? (json["origin_history"] as RecipeDraft["origin_history"])
    : [];
  draft.ingredients = Array.isArray(json["ingredients"])
    ? (json["ingredients"] as Record<string, unknown>[]).map((i) => ({
        quantity: i["q"] === null || i["q"] === undefined ? null : Number(i["q"]),
        unit: String(i["u"] ?? ""),
        name: String(i["n"] ?? ""),
        note: (i["note"] as string) ?? null,
      }))
    : [];
  draft.comments = Array.isArray(json["comments"])
    ? (json["comments"] as Record<string, unknown>[]).map((c) => ({
        entry_date: String(c["d"] ?? todayISO()),
        body: String(c["t"] ?? ""),
      }))
    : [];

  if (!draft.title.trim()) {
    return { ok: false, error: "La receta del archivo no tiene nombre." };
  }
  return { ok: true, draft, originalAuthor: draft.original_author_name };
}

/* ---------------- análisis de texto libre ---------------- */

const ING_HEAD = /^(?:para\s+(?:los|las)\s+)?ingredientes?\b[:.]?$/i;
const PREP_HEAD =
  /^(?:modo\s+de\s+)?(?:preparaci[oó]n|procedimiento|paso\s*a\s*paso|pasos|elaboraci[oó]n|instrucciones|preparar)\b[:.]?$/i;
const DESC_HEAD = /^(?:descripci[oó]n|acerca|sobre\s+la\s+receta)\b[:.]?$/i;
const COMMENT_HEAD = /^(?:mis\s+comentarios|comentarios|notas)\b[:.]?$/i;

const FRACTIONS: Record<string, number> = {
  "½": 0.5,
  "¼": 0.25,
  "¾": 0.75,
  "⅓": 1 / 3,
  "⅔": 2 / 3,
};

export function parseIngredientLine(raw: string): Ingredient | null {
  let line = raw
    .replace(/^[\s•*\-–—·]+/, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!line) return null;

  let quantity: number | null = null;
  const fracMatch = line.match(/^([½¼¾⅓⅔])\s*/);
  const numMatch = line.match(/^(\d+(?:[.,]\d+)?)(?:\s*\/\s*(\d+))?\s*/);
  if (fracMatch) {
    quantity = FRACTIONS[fracMatch[1] ?? ""] ?? null;
    line = line.slice(fracMatch[0]?.length ?? 0);
  } else if (numMatch) {
    const a = parseFloat((numMatch[1] ?? "0").replace(",", "."));
    const b = numMatch[2] ? parseFloat(numMatch[2]) : null;
    quantity = b ? a / b : a;
    line = line.slice(numMatch[0]?.length ?? 0);
  }

  let unit = "";
  const words = line.split(" ");
  const candidate = normalizeUnit(words[0] ?? "");
  if (candidate) {
    unit = candidate;
    words.shift();
  }
  let name = words.join(" ").trim();
  name = name.replace(/^de\s+/i, "").trim();

  let note: string | null = null;
  const noteMatch = name.match(/\(([^)]*)\)\s*$/);
  if (noteMatch) {
    note = (noteMatch[1] ?? "").trim();
    name = name.slice(0, noteMatch.index ?? name.length).trim();
  }
  if (!name) return null;
  return { quantity, unit, name, note };
}

export interface TextParseResult {
  draft: RecipeDraft;
  warnings: string[];
}

/** Convierte texto libre pegado o escaneado en una receta estructurada. */
export function parseRecipeText(text: string): TextParseResult {
  const draft = emptyDraft();
  const warnings: string[] = [];
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim());

  let section: "head" | "desc" | "ing" | "prep" | "com" = "head";
  const desc: string[] = [];
  const prep: string[] = [];
  const com: string[] = [];
  const ingLines: string[] = [];
  const head: string[] = [];

  for (const line of lines) {
    if (!line) continue;
    if (ING_HEAD.test(line)) {
      section = "ing";
      continue;
    }
    if (PREP_HEAD.test(line)) {
      section = "prep";
      continue;
    }
    if (DESC_HEAD.test(line)) {
      section = "desc";
      continue;
    }
    if (COMMENT_HEAD.test(line)) {
      section = "com";
      continue;
    }
    if (/^[━─=_]{4,}$/.test(line)) continue;

    if (section === "head") head.push(line);
    else if (section === "desc") desc.push(line);
    else if (section === "ing") ingLines.push(line);
    else if (section === "prep") prep.push(line);
    else com.push(line);
  }

  if (head.length) {
    draft.title = (head[0] ?? "").replace(/^#+\s*/, "").replace(/[:.]$/, "").trim();
    if (head.length > 1) desc.unshift(...head.slice(1));
  }
  if (!draft.title) warnings.push("No se pudo detectar el nombre de la receta.");

  draft.description = desc.join(" ").trim();
  draft.instructions = prep
    .map((l) => l.replace(/^\d+[).\-]\s*/, "").trim())
    .filter(Boolean)
    .map((l, index) => `${index + 1}. ${l}`)
    .join("\n");
  if (!draft.instructions) warnings.push("No se detectó la preparación.");

  draft.ingredients = ingLines
    .map(parseIngredientLine)
    .filter((i): i is Ingredient => i !== null);
  if (!draft.ingredients.length) warnings.push("No se detectaron ingredientes.");

  if (com.length) {
    draft.comments = [{ entry_date: todayISO(), body: com.join("\n") }];
  }

  draft.keywords = suggestKeywords(draft.title, draft.ingredients);
  draft.origin_type = "texto";
  draft.original_author_name = "Copiada de";
  return { draft, warnings };
}

const STOPWORDS = new Set([
  "de",
  "del",
  "la",
  "el",
  "los",
  "las",
  "con",
  "y",
  "al",
  "en",
  "para",
  "sin",
  "un",
  "una",
]);

export function suggestKeywords(title: string, ingredients: Ingredient[]): string[] {
  const words = title
    .split(/[\s,]+/)
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter((w) => w.length > 2 && !STOPWORDS.has(foldText(w)));
  const ing = ingredients.slice(0, 4).map((i) => i.name.split(" ")[0] ?? "");
  return Array.from(new Set([...words, ...ing].map((w) => w.toLowerCase()).filter(Boolean))).slice(
    0,
    8,
  );
}
