export type RecipeStatus = "listo" | "borrador";
export type OriginType = "propia" | "texto" | "compartida" | "copiada" | "escaneada";

export interface Ingredient {
  id?: string;
  quantity: number | null;
  unit: string;
  name: string;
  note?: string | null;
}

export interface RecipeComment {
  id?: string;
  entry_date: string;
  body: string;
}

export interface Recipe {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  keywords: string[];
  instructions: string;
  video_links: string[];
  image_url: string | null;
  status: RecipeStatus;
  origin_type: OriginType;
  original_author_name: string;
  original_author_id: string | null;
  shared_by_name: string | null;
  source_note: string | null;
  origin_history: { user: string; action: string; date: string }[];
  created_at: string;
  updated_at: string;
}

export interface RecipeDraft {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  keywords: string[];
  instructions: string;
  video_links: string[];
  image_url: string | null;
  status: RecipeStatus;
  origin_type: OriginType;
  original_author_name: string;
  original_author_id: string | null;
  shared_by_name: string | null;
  source_note: string | null;
  origin_history: { user: string; action: string; date: string }[];
  ingredients: Ingredient[];
  comments: RecipeComment[];
}

export interface FullRecipe extends Recipe {
  ingredients: Ingredient[];
  comments: RecipeComment[];
}

export interface Profile {
  id: string;
  owner_name: string;
  username: string;
  book_name: string;
  palette: string;
}

export function emptyDraft(): RecipeDraft {
  return {
    title: "",
    description: "",
    category: "",
    subcategory: "",
    keywords: [],
    instructions: "",
    video_links: [],
    image_url: null,
    status: "listo",
    origin_type: "propia",
    original_author_name: "",
    original_author_id: null,
    shared_by_name: null,
    source_note: null,
    origin_history: [],
    ingredients: [],
    comments: [],
  };
}
