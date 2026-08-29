import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Download, Pencil, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Protected } from "@/components/Protected";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { RecipeImage } from "@/components/RecipeImage";
import { Button } from "@/components/ui/button";
import { createRecipe, deleteRecipe, fetchRecipe, removeRecipeImage } from "@/lib/db";
import {
  formatDate,
  ingredientLine,
  recipeToPlainText,
  toArkRecipe,
  todayISO,
} from "@/lib/recipe-text";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/receta/$id")({
  head: () => ({
    meta: [
      { title: "Receta — Grimorio Dev" },
      {
        name: "description",
        content:
          "Lee la receta completa con ingredientes, preparación y tus comentarios; compártela o edítala cuando quieras.",
      },
      { property: "og:title", content: "Receta — Grimorio Dev" },
      {
        property: "og:description",
        content: "Ingredientes, preparación y comentarios de tu receta guardada.",
      },
    ],
  }),
  component: () => (
    <Protected>
      <RecipeDetail />
    </Protected>
  ),
});

function RecipeDetail() {
  const { id } = useParams({ from: "/receta/$id" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipe(id),
  });

  if (isLoading) {
    return (
      <AppShell title="Receta" back>
        <p className="py-10 text-center text-sm text-muted-foreground">Cargando receta…</p>
      </AppShell>
    );
  }

  if (!recipe) {
    return (
      <AppShell title="Receta no encontrada" back>
        <div className="py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Esta receta ya no existe o no está en tu libro.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Volver a mi libro</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const me = profile?.username || profile?.owner_name || "Yo";

  async function share() {
    if (!recipe) return;
    const text = recipeToPlainText(recipe);
    try {
      if (navigator.share) {
        await navigator.share({ title: recipe.title, text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Receta copiada. Ya puedes pegarla donde quieras.");
      }
    } catch {
      /* el usuario canceló */
    }
  }

  function exportFile() {
    if (!recipe) return;
    const data = JSON.stringify(toArkRecipe(recipe, me), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recipe.title.replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase()}.arkrecipe`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function duplicate() {
    if (!recipe || !user) return;
    try {
      const newId = await createRecipe(
        {
          ...recipe,
          title: `${recipe.title} (copia)`,
          origin_type: "copiada",
          origin_history: [
            ...(recipe.origin_history ?? []),
            { user: me, action: "duplicada", date: todayISO() },
          ],
        },
        user.id,
      );
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("Receta duplicada");
      navigate({ to: "/receta/$id", params: { id: newId } });
    } catch {
      toast.error("No pudimos duplicar la receta.");
    }
  }

  async function remove() {
    if (!recipe) return;
    try {
      await removeRecipeImage(recipe.image_url);
      await deleteRecipe(recipe.id);
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("Receta eliminada");
      navigate({ to: "/", replace: true });
    } catch {
      toast.error("No pudimos eliminar la receta.");
    }
  }

  return (
    <AppShell
      title={recipe.title}
      subtitle={[recipe.category, recipe.subcategory].filter(Boolean).join(" · ")}
      back
      action={
        <Link
          to="/receta/$id/editar"
          params={{ id: recipe.id }}
          aria-label="Editar receta"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-ink hover:bg-accent"
        >
          <Pencil className="size-5" />
        </Link>
      }
    >
      <article className="space-y-6 pb-10">
        {recipe.status === "borrador" ? (
          <p className="rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
            Esta receta está guardada como borrador.
          </p>
        ) : null}

        <RecipeImage
          path={recipe.image_url}
          alt={recipe.title}
          className="h-52 w-full rounded-2xl"
        />

        <div className="space-y-1 text-xs text-muted-foreground">
          <p>Autor: {recipe.original_author_name || "Sin autor"}</p>
          {recipe.shared_by_name ? <p>Compartida por: {recipe.shared_by_name}</p> : null}
          {recipe.source_note ? <p>Fuente: {recipe.source_note}</p> : null}
        </div>

        {recipe.description ? (
          <section className="space-y-1">
            <h2 className="text-base font-semibold">Descripción</h2>
            <p className="reading whitespace-pre-line text-sm">{recipe.description}</p>
          </section>
        ) : null}

        {recipe.ingredients.length ? (
          <section className="space-y-2">
            <h2 className="text-base font-semibold">Ingredientes</h2>
            <ul className="divide-y rounded-xl border bg-card">
              {recipe.ingredients.map((i, index) => (
                <li key={i.id ?? index} className="px-3 py-2.5 text-sm">
                  {ingredientLine(i)}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {recipe.instructions ? (
          <section className="space-y-2">
            <h2 className="text-base font-semibold">Preparación</h2>
            <p className="reading whitespace-pre-line text-sm leading-relaxed">
              {recipe.instructions}
            </p>
          </section>
        ) : null}

        {recipe.comments.length ? (
          <section className="space-y-2">
            <h2 className="text-base font-semibold">Mis comentarios</h2>
            <ul className="space-y-2">
              {recipe.comments.map((c, index) => (
                <li key={c.id ?? index} className="rounded-xl border bg-card p-3">
                  <p className="text-xs font-semibold text-primary">{formatDate(c.entry_date)}</p>
                  <p className="mt-1 whitespace-pre-line text-sm">{c.body}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {recipe.keywords.length ? (
          <ul className="flex flex-wrap gap-1.5">
            {recipe.keywords.map((k) => (
              <li key={k} className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                {k}
              </li>
            ))}
          </ul>
        ) : null}

        <section className="grid grid-cols-2 gap-2">
          <Button onClick={share} className="h-12">
            <Share2 className="size-4" /> Compartir
          </Button>
          <Button variant="outline" className="h-12" onClick={exportFile}>
            <Download className="size-4" /> Archivo
          </Button>
          <Button variant="outline" className="h-12" onClick={duplicate}>
            <Copy className="size-4" /> Duplicar
          </Button>
          <ConfirmDialog
            title="¿Eliminar esta receta?"
            description="Se borrará de tu libro en todos tus dispositivos."
            confirmLabel="Eliminar"
            onConfirm={remove}
            trigger={
              <Button variant="outline" className="h-12 text-destructive">
                <Trash2 className="size-4" /> Eliminar
              </Button>
            }
          />
        </section>
      </article>
    </AppShell>
  );
}
