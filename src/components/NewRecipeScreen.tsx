import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { RecipeForm } from "@/components/RecipeForm";
import { createRecipe } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { todayISO } from "@/lib/recipe-text";
import type { RecipeDraft } from "@/lib/types";

/** Pantalla común para crear una receta (escrita, pegada, importada o escaneada). */
export function NewRecipeScreen({
  title,
  subtitle,
  initial,
  banner,
}: {
  title: string;
  subtitle?: string;
  initial: RecipeDraft;
  banner?: ReactNode;
}) {
  const [draft, setDraft] = useState<RecipeDraft>(initial);
  const [saving, setSaving] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function submit() {
    if (!user) return;
    setSaving(true);
    const me = profile?.username || profile?.owner_name || "Yo";
    const payload: RecipeDraft = {
      ...draft,
      original_author_name: draft.original_author_name?.trim() || me,
      original_author_id: draft.origin_type === "propia" ? user.id : draft.original_author_id,
      origin_history: [
        ...draft.origin_history,
        { user: me, action: draft.origin_type === "propia" ? "creada" : "guardada", date: todayISO() },
      ],
    };
    try {
      const id = await createRecipe(payload, user.id);
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success(payload.status === "borrador" ? "Borrador guardado" : "Receta guardada");
      navigate({ to: "/receta/$id", params: { id } });
    } catch {
      toast.error("No pudimos guardar la receta. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell title={title} subtitle={subtitle} back>
      <div className="space-y-4 pb-6">
        {banner}
        <RecipeForm
          draft={draft}
          onDraftChange={setDraft}
          onSubmit={submit}
          onCancel={() => navigate({ to: "/" })}
          saving={saving}
        />
      </div>
    </AppShell>
  );
}
