-- PROFILES
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  owner_name TEXT NOT NULL DEFAULT '',
  username TEXT NOT NULL UNIQUE,
  book_name TEXT NOT NULL DEFAULT 'Mi libro de recetas',
  palette TEXT NOT NULL DEFAULT 'verde',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- CATEGORIES
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  position INT NOT NULL DEFAULT 0
);
CREATE TABLE public.subcategories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  UNIQUE (category_id, name)
);
GRANT SELECT ON public.categories TO authenticated, anon;
GRANT SELECT ON public.subcategories TO authenticated, anon;
GRANT ALL ON public.categories TO service_role;
GRANT ALL ON public.subcategories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_read_all" ON public.categories FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "subcategories_read_all" ON public.subcategories FOR SELECT TO authenticated, anon USING (true);

INSERT INTO public.categories (name, position) VALUES ('Salado', 1), ('Dulce', 2);
INSERT INTO public.subcategories (category_id, name, position)
SELECT c.id, s.name, s.position FROM public.categories c
JOIN (VALUES
  ('Salado','Masas y Panes',1),('Salado','Antojos y Comida Rápida',2),('Salado','Entradas',3),
  ('Salado','Cocina Internacional',4),('Salado','Platos Principales',5),
  ('Dulce','Masas Dulces',1),('Dulce','Frituras Dulces',2),('Dulce','Repostería',3),
  ('Dulce','Postres',4),('Dulce','Dulces',5)
) AS s(cat,name,position) ON s.cat = c.name;

-- RECIPES
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  subcategory TEXT NOT NULL DEFAULT '',
  keywords TEXT[] NOT NULL DEFAULT '{}',
  instructions TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'listo',
  origin_type TEXT NOT NULL DEFAULT 'propia',
  original_author_name TEXT NOT NULL DEFAULT '',
  original_author_id UUID,
  shared_by_name TEXT,
  source_note TEXT,
  origin_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX recipes_owner_idx ON public.recipes (owner_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recipes TO authenticated;
GRANT ALL ON public.recipes TO service_role;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "recipes_select_own" ON public.recipes FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "recipes_insert_own" ON public.recipes FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "recipes_update_own" ON public.recipes FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "recipes_delete_own" ON public.recipes FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- INGREDIENTS
CREATE TABLE public.recipe_ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  position INT NOT NULL DEFAULT 0,
  quantity NUMERIC,
  unit TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX recipe_ingredients_recipe_idx ON public.recipe_ingredients (recipe_id, position);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recipe_ingredients TO authenticated;
GRANT ALL ON public.recipe_ingredients TO service_role;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ingredients_all_own" ON public.recipe_ingredients FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- COMMENTS
CREATE TABLE public.recipe_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX recipe_comments_recipe_idx ON public.recipe_comments (recipe_id, entry_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recipe_comments TO authenticated;
GRANT ALL ON public.recipe_comments TO service_role;
ALTER TABLE public.recipe_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_all_own" ON public.recipe_comments FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.grimorio_touch_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER recipes_touch BEFORE UPDATE ON public.recipes FOR EACH ROW EXECUTE FUNCTION public.grimorio_touch_updated_at();
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.grimorio_touch_updated_at();

-- STORAGE POLICIES (bucket recipe-images, private)
CREATE POLICY "recipe_images_select_own" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'recipe-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "recipe_images_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'recipe-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "recipe_images_update_own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'recipe-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "recipe_images_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'recipe-images' AND (storage.foldername(name))[1] = auth.uid()::text);