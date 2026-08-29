import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Protected } from "@/components/Protected";
import { RecipeForm } from "@/components/RecipeForm";
import { fetchRecipe, saveRecipe } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { emptyDraft, type RecipeDraft } from "@/lib/types";

export const Route = createFileRoute("/editar/$id")({
  head: () => ({
    meta: [
      { title: "Editar receta — Grimorio Dev" },
      {
        name: "description",
        content:
          "Corrige ingredientes, cantidades, preparación, imagen y comentarios de una receta guardada en tu libro.",
      },
      { property: "og:title", content: "Editar receta — Grimorio Dev" },
      {
        property: "og:description",
        content: "Ajusta tu receta cuando descubras una mejora en la preparación.",
      },
    ],
  }),
  component: () => (
    <Protected>
      <EditRecipe />
    </Protected>
  ),
});

function EditRecipe() {
  const { id } = useParams({ from: "/editar/$id" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [draft, setDraft] = useState<RecipeDraft | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipe(id),
  });

  useEffect(() => {
    if (!recipe) return;
    setDraft({ ...emptyDraft(), ...recipe });
  }, [recipe]);

  async function submit() {
    if (!draft || !user) return;
    setSaving(true);
    try {
      await saveRecipe(id, draft, user.id);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["recipes"] }),
        queryClient.invalidateQueries({ queryKey: ["recipe", id] }),
      ]);
      toast.success("Cambios guardados");
      navigate({ to: "/receta/$id", params: { id } });
    } catch {
      toast.error("No pudimos guardar los cambios. Revisa tu conexión.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell title="Editar receta" subtitle={draft?.title} back action={<span />}>
      {isLoading || !draft ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Cargando receta…</p>
      ) : (
        <div className="pb-6">
          <RecipeForm
            draft={draft}
            onDraftChange={setDraft}
            onSubmit={submit}
            onCancel={() => navigate({ to: "/receta/$id", params: { id } })}
            saving={saving}
            submitLabel="Guardar cambios"
          />
        </div>
      )}
    </AppShell>
  );
}
