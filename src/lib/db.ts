import { supabase } from "@/integrations/supabase/client";
import type {
  FullRecipe,
  Ingredient,
  Profile,
  Recipe,
  RecipeComment,
  RecipeDraft,
} from "./types";

/* ---------- perfil ---------- */

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, owner_name, username, book_name, palette")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as Profile) ?? null;
}

export async function updateProfile(userId: string, patch: Partial<Profile>) {
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) throw error;
}

/* ---------- índice ---------- */

export async function fetchRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Recipe[];
}

export async function fetchRecipe(id: string): Promise<FullRecipe | null> {
  const { data, error } = await supabase.from("recipes").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const [ing, com] = await Promise.all([
    supabase
      .from("recipe_ingredients")
      .select("id, quantity, unit, name, note")
      .eq("recipe_id", id)
      .order("position"),
    supabase
      .from("recipe_comments")
      .select("id, entry_date, body")
      .eq("recipe_id", id)
      .order("entry_date", { ascending: false }),
  ]);
  if (ing.error) throw ing.error;
  if (com.error) throw com.error;

  return {
    ...(data as unknown as Recipe),
    ingredients: (ing.data ?? []).map((i) => ({
      id: i.id,
      quantity: i.quantity === null ? null : Number(i.quantity),
      unit: i.unit ?? "",
      name: i.name,
      note: i.note,
    })) as Ingredient[],
    comments: (com.data ?? []) as RecipeComment[],
  };
}

/* ---------- escritura ---------- */

function recipeRow(draft: RecipeDraft, ownerId: string) {
  return {
    owner_id: ownerId,
    title: draft.title.trim(),
    description: draft.description,
    category: draft.category,
    subcategory: draft.subcategory,
    keywords: draft.keywords,
    instructions: draft.instructions,
    video_links: draft.video_links ?? [],
    image_url: draft.image_url,
    status: draft.status,
    origin_type: draft.origin_type,
    original_author_name: draft.original_author_name,
    original_author_id: draft.original_author_id,
    shared_by_name: draft.shared_by_name,
    source_note: draft.source_note,
    origin_history: draft.origin_history,
  };
}

async function replaceChildren(recipeId: string, ownerId: string, draft: RecipeDraft) {
  await supabase.from("recipe_ingredients").delete().eq("recipe_id", recipeId);
  await supabase.from("recipe_comments").delete().eq("recipe_id", recipeId);

  if (draft.ingredients.length) {
    const { error } = await supabase.from("recipe_ingredients").insert(
      draft.ingredients.map((i, index) => ({
        recipe_id: recipeId,
        owner_id: ownerId,
        position: index,
        quantity: i.quantity,
        unit: i.unit,
        name: i.name,
        note: i.note ?? null,
      })),
    );
    if (error) throw error;
  }
  if (draft.comments.length) {
    const { error } = await supabase.from("recipe_comments").insert(
      draft.comments.map((c) => ({
        recipe_id: recipeId,
        owner_id: ownerId,
        entry_date: c.entry_date,
        body: c.body,
      })),
    );
    if (error) throw error;
  }
}

export async function createRecipe(draft: RecipeDraft, ownerId: string): Promise<string> {
  const { data, error } = await supabase
    .from("recipes")
    .insert(recipeRow(draft, ownerId))
    .select("id")
    .single();
  if (error) throw error;
  await replaceChildren(data.id, ownerId, draft);
  return data.id;
}

export async function saveRecipe(id: string, draft: RecipeDraft, ownerId: string) {
  const { error } = await supabase.from("recipes").update(recipeRow(draft, ownerId)).eq("id", id);
  if (error) throw error;
  await replaceChildren(id, ownerId, draft);
}

export async function deleteRecipe(id: string) {
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) throw error;
}

/** Renombrar autor visible en las recetas propias del usuario. */
export async function renameOwnAuthor(userId: string, newUsername: string) {
  const { error } = await supabase
    .from("recipes")
    .update({ original_author_name: newUsername })
    .eq("owner_id", userId)
    .eq("original_author_id", userId);
  if (error) throw error;
}

/* ---------- imágenes ---------- */

export async function uploadRecipeImage(userId: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("recipe-images").upload(path, file, {
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw error;
  return path;
}

export async function imageUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  const { data } = await supabase.storage.from("recipe-images").createSignedUrl(path, 60 * 60 * 8);
  return data?.signedUrl ?? null;
}

export async function removeRecipeImage(path: string | null) {
  if (!path || path.startsWith("http")) return;
  await supabase.storage.from("recipe-images").remove([path]);
}
