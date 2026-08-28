import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { BookOpen, ChevronDown, FileEdit, Plus, Search, X } from "lucide-react";

import { AppShell, ConnectionBadge } from "@/components/AppShell";
import { Protected } from "@/components/Protected";
import { RecipeImage } from "@/components/RecipeImage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchRecipes } from "@/lib/db";
import { foldText } from "@/lib/recipe-text";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { Recipe } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grimorio Dev — Tu cuaderno digital de recetas" },
      {
        name: "description",
        content:
          "Guarda, organiza, busca y comparte tus recetas de siempre. La simplicidad de un cuaderno con la comodidad de una app moderna.",
      },
      { property: "og:title", content: "Grimorio Dev — Tu cuaderno digital de recetas" },
      {
        property: "og:description",
        content: "Guarda, organiza, busca y comparte tus recetas favoritas desde el teléfono.",
      },
    ],
  }),
  component: () => (
    <Protected>
      <Library />
    </Protected>
  ),
});

function Library() {
  const { profile } = useAuth();
  const [query, setQuery] = useState("");
  const [openCat, setOpenCat] = useState<string | null>(null);

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes"],
    queryFn: fetchRecipes,
  });

  const list = recipes ?? [];
  const drafts = list.filter((r) => r.status === "borrador");
  const ready = list.filter((r) => r.status === "listo");

  const results = useMemo(() => {
    const q = foldText(query);
    if (!q) return null;
    return list.filter((r) =>
      [r.title, r.description, r.category, r.subcategory, ...r.keywords]
        .map(foldText)
        .some((field) => field.includes(q)),
    );
  }, [list, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Recipe[]>();
    ready.forEach((r) => {
      const key = r.category || "Sin categoría";
      map.set(key, [...(map.get(key) ?? []), r]);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [ready]);

  return (
    <AppShell
      title={profile?.book_name || "Mi libro de recetas"}
      subtitle={`${list.length} ${list.length === 1 ? "receta" : "recetas"}`}
    >
      <div className="space-y-5 pb-24">
        <ConnectionBadge />

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar receta o ingrediente"
            className="h-12 pl-9 pr-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Cargando tu libro…</p>
        ) : list.length === 0 ? (
          <EmptyState />
        ) : results ? (
          results.length ? (
            <ul className="space-y-2">
              {results.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </ul>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No encontramos recetas con “{query}”.
            </p>
          )
        ) : (
          <>
            {drafts.length ? (
              <section className="space-y-2">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <FileEdit className="size-4" /> Borradores ({drafts.length})
                </h2>
                <ul className="space-y-2">
                  {drafts.map((r) => (
                    <RecipeCard key={r.id} recipe={r} />
                  ))}
                </ul>
              </section>
            ) : null}

            {grouped.map(([category, items]) => {
              const open = openCat === category || grouped.length === 1;
              return (
                <section key={category} className="overflow-hidden rounded-2xl border bg-card">
                  <button
                    type="button"
                    onClick={() => setOpenCat(open && openCat === category ? null : category)}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left"
                  >
                    <span className="flex-1 font-semibold">{category}</span>
                    <span className="text-xs text-muted-foreground">{items.length}</span>
                    <ChevronDown
                      className={cn("size-4 transition-transform", open && "rotate-180")}
                    />
                  </button>
                  {open ? (
                    <ul className="space-y-2 border-t p-2">
                      {items.map((r) => (
                        <RecipeCard key={r.id} recipe={r} />
                      ))}
                    </ul>
                  ) : null}
                </section>
              );
            })}
          </>
        )}
      </div>

      <Link
        to="/agregar"
        aria-label="Agregar receta"
        className="fixed bottom-6 left-1/2 z-30 flex h-14 -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lift"
      >
        <Plus className="size-5" /> Agregar receta
      </Link>
    </AppShell>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border-2 border-dashed p-8 text-center">
      <BookOpen className="mx-auto size-8 text-muted-foreground" />
      <h2 className="mt-3 font-semibold">Tu libro está en blanco</h2>
      <p className="reading mx-auto mt-1 text-sm text-muted-foreground">
        Agrega tu primera receta, pega una que te compartieron o escanea una página de tu cuaderno.
      </p>
      <Button asChild className="mt-4">
        <Link to="/agregar">
          <Plus className="size-4" /> Agregar mi primera receta
        </Link>
      </Button>
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <li>
      <Link
        to="/receta/$id"
        params={{ id: recipe.id }}
        className="flex items-center gap-3 rounded-xl border bg-card p-2.5 transition-colors hover:bg-accent/50"
      >
        <RecipeImage
          path={recipe.image_url}
          alt={recipe.title}
          className="size-14 shrink-0 rounded-lg"
          fallback
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{recipe.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {[recipe.subcategory || recipe.category, recipe.description].filter(Boolean).join(" · ")}
          </p>
        </div>
        {recipe.status === "borrador" ? (
          <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            Borrador
          </span>
        ) : null}
      </Link>
    </li>
  );
}
