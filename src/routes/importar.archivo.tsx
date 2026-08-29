import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileDown } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Protected } from "@/components/Protected";
import { NewRecipeScreen } from "@/components/NewRecipeScreen";
import { parseArkRecipe, todayISO } from "@/lib/recipe-text";
import { useAuth } from "@/lib/auth";
import type { RecipeDraft } from "@/lib/types";

export const Route = createFileRoute("/importar/archivo")({
  head: () => ({
    meta: [
      { title: "Importar archivo .arkrecipe — Grimorio Dev" },
      {
        name: "description",
        content:
          "Abre un archivo .arkrecipe compartido y guarda la receta en tu libro conservando el autor original.",
      },
      { property: "og:title", content: "Importar archivo .arkrecipe — Grimorio Dev" },
      {
        property: "og:description",
        content: "Recupera recetas compartidas entre usuarios de Grimorio Dev.",
      },
    ],
  }),
  component: () => (
    <Protected>
      <ImportFile />
    </Protected>
  ),
});

function ImportFile() {
  const { profile } = useAuth();
  const [draft, setDraft] = useState<RecipeDraft | null>(null);
  const [author, setAuthor] = useState("");

  async function readFile(file: File | undefined) {
    if (!file) return;
    const raw = await file.text();
    const result = parseArkRecipe(raw);
    if (!result.ok || !result.draft) {
      toast.error(result.error ?? "No pudimos leer el archivo.");
      return;
    }
    const me = profile?.username || profile?.owner_name || "Yo";
    setAuthor(result.originalAuthor ?? "Desconocido");
    setDraft({
      ...result.draft,
      origin_history: [
        ...result.draft.origin_history,
        { user: me, action: "importada", date: todayISO() },
      ],
    });
  }

  if (draft) {
    return (
      <NewRecipeScreen
        title="Receta importada"
        subtitle={`Autor original: ${author}`}
        initial={draft}
        banner={
          <p className="rounded-xl border bg-accent/50 p-3 text-xs text-muted-foreground">
            Guardaremos una copia en tu libro. El autor original ({author}) queda registrado en la
            receta.
          </p>
        }
      />
    );
  }

  return (
    <AppShell title="Importar archivo" subtitle="Archivos .arkrecipe" back>
      <div className="space-y-4 pb-10">
        <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-sm text-muted-foreground hover:bg-secondary">
          <FileDown className="size-6" />
          Elegir archivo .arkrecipe
          <input
            type="file"
            accept=".arkrecipe,application/json"
            className="hidden"
            onChange={(e) => readFile(e.target.files?.[0])}
          />
        </label>
        <p className="text-xs text-muted-foreground">
          Los archivos .arkrecipe se generan al compartir una receta desde Grimorio Dev.
        </p>
      </div>
    </AppShell>
  );
}
